import type { RefObject } from 'react';

const MAX_CARD_WIDTH = 380;
const HOVER_BUFFER = 24;

export function computeCardLayout(el: HTMLElement, itemsPerView: number) {
  const style = getComputedStyle(el);
  const gap = parseFloat(style.gap || style.columnGap || '0') || 0;

  const containerMax = itemsPerView * MAX_CARD_WIDTH + gap * (itemsPerView - 1) + HOVER_BUFFER * 2;

  const available = Math.min(el.clientWidth, containerMax) - gap * (itemsPerView - 1) - HOVER_BUFFER * 2;

  const cardWidth = Math.min(MAX_CARD_WIDTH, Math.max(1, Math.floor(available / itemsPerView)));

  return { cardWidth, gap };
}

export function getStep(cardWidth: number, gap: number) {
  return cardWidth + gap || 1;
}

export function applyLayoutToRef(
  el: HTMLElement,
  itemsPerView: number,
  layoutRef: { current: { cardWidth: number; gap: number } }
) {
  const { cardWidth, gap } = computeCardLayout(el, itemsPerView);
  layoutRef.current = { cardWidth, gap };
  return { cardWidth, gap };
}

export function computeLeftForIndex(
  index: number,
  cardWidth: number,
  gap: number,
  scrollWidth: number,
  clientWidth: number
) {
  const step = getStep(cardWidth, gap);
  const maxLeft = scrollWidth - clientWidth;
  return Math.min(index * step, maxLeft);
}

export function goToIndexImpl(
  el: HTMLElement | null,
  layoutRef: { current: { cardWidth: number; gap: number } },
  index: number
) {
  if (!el) return false;
  const { cardWidth, gap } = layoutRef.current;
  const step = getStep(cardWidth, gap);
  const maxLeft = el.scrollWidth - el.clientWidth;

  el.scrollTo({ left: Math.min(index * step, maxLeft), behavior: 'smooth' });
  return true;
}

export function scrollByCardsImpl(
  el: HTMLElement | null,
  layoutRef: { current: { cardWidth: number; gap: number } },
  delta: number,
  dataLength: number,
  itemsPerView: number
) {
  if (!el) return null;
  const { cardWidth, gap } = layoutRef.current;
  const step = getStep(cardWidth, gap);

  const current = Math.round(el.scrollLeft / step);
  const maxIndex = Math.max(0, dataLength - itemsPerView);

  let next = current + delta;
  if (next > maxIndex) next = 0;
  if (next < 0) next = maxIndex;

  goToIndexImpl(el, layoutRef, next);
  return next;
}

type LayoutRef = { current: { cardWidth: number; gap: number } };

export function setupPointerHandlers(options: {
  containerRef: RefObject<HTMLElement | null>;
  drag: { current: { active: boolean; startX: number; scrollStart: number; desiredScroll: number } };
  rafRef: { current: number | null };
  layoutRef: LayoutRef;
  autoplay: { pause: () => void; resume: () => void };
  goToIndex: (index: number) => void;
}) {
  const { containerRef, drag, rafRef, layoutRef, autoplay, goToIndex } = options;

  const el = containerRef.current;
  if (!el) return () => {};

  let snapRestoreTimeout: number | null = null;
  let isRestoringSnap = false;
  let mobilePauseTimeout: number | null = null;
  let hasMobileDragged = false;

  const onPointerDown = (e: PointerEvent) => {
    autoplay.pause();

    if (e.pointerType === 'touch') {
      hasMobileDragged = true;
    } else {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest('button, a, input, textarea, select, label, [role="button"], [contenteditable], [data-no-drag]')
      ) {
        return;
      }

      drag.current.active = true;
      drag.current.startX = e.clientX;
      drag.current.scrollStart = el.scrollLeft;
      drag.current.desiredScroll = el.scrollLeft;

      if (snapRestoreTimeout) {
        clearTimeout(snapRestoreTimeout);
        snapRestoreTimeout = null;
        isRestoringSnap = false;
      }

      el.setPointerCapture?.(e.pointerId);
      el.classList.add('dragging');
      el.style.scrollBehavior = 'auto';
      el.style.scrollSnapType = 'none';
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current.active) return;

    const dx = drag.current.startX - e.clientX;
    drag.current.desiredScroll = drag.current.scrollStart + dx;

    if (rafRef.current == null) {
      const step = () => {
        el.scrollLeft = drag.current.desiredScroll;

        if (drag.current.active) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') {
      drag.current.active = false;
      el.releasePointerCapture?.(e.pointerId);
      el.classList.remove('dragging');
      el.style.scrollBehavior = 'smooth';
      el.style.scrollSnapType = 'none';
    }

    if (e.pointerType === 'touch' && hasMobileDragged) {
      clearTimeout(mobilePauseTimeout!);
      mobilePauseTimeout = window.setTimeout(() => {
        autoplay.resume();
        hasMobileDragged = false;
        mobilePauseTimeout = null;
      }, 15000);
    }

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const { cardWidth, gap } = layoutRef.current;
    const step = getStep(cardWidth, gap);
    const nearest = Math.round(el.scrollLeft / step);
    goToIndex(nearest);
    enableSnapAfterScroll();
  };

  const enableSnapAfterScroll = () => {
    if (isRestoringSnap) return;
    isRestoringSnap = true;

    const onScrollEnd = () => {
      if (snapRestoreTimeout) clearTimeout(snapRestoreTimeout);
      snapRestoreTimeout = window.setTimeout(() => {
        el.style.scrollBehavior = '';
        el.style.scrollSnapType = 'x mandatory';
        el.removeEventListener('scroll', onScrollEnd);
        snapRestoreTimeout = null;
        isRestoringSnap = false;
      }, 100);
    };

    el.addEventListener('scroll', onScrollEnd, { passive: true });
  };

  el.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (mobilePauseTimeout) clearTimeout(mobilePauseTimeout);
  };
}
