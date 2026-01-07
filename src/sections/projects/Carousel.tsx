import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAutoplay } from '@hooks/useAutoplay';
import type { ProjectCardDetails } from '@data/projects/Projects.data';
import ProjectCard from './ProjectCard';
import {
  getStep,
  applyLayoutToRef,
  goToIndexImpl,
  scrollByCardsImpl,
  setupPointerHandlers,
  MAX_CARD_WIDTH,
  HOVER_BUFFER,
} from './Carousel.utils';

type Props = {
  data: ProjectCardDetails[];
};

export default function Carousel({ data }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollStart: 0,
    desiredScroll: 0,
    lockedAxis: null,
  });

  const rafRef = useRef<number | null>(null);

  const layoutRef = useRef({
    cardWidth: 0,
    gap: 0,
  });

  const [itemsPerView, setItemsPerView] = useState<number>(3);
  const [cardWidthPx, setCardWidthPx] = useState<number>(0);
  const [gapPx, setGapPx] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showArrows, setShowArrows] = useState<boolean>(true);

  /* Responsive itemsPerView */

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      const desiredItemsPerView = w >= 1024 ? 3 : w >= 768 ? 2 : 1;

      const effectiveItemsPerView = Math.min(desiredItemsPerView, data.length);

      setItemsPerView(effectiveItemsPerView);
      setShowArrows(data.length > effectiveItemsPerView);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [data.length]);

  /* Layout calculation + scroll tracking */

  useLayoutEffect(() => {
    const el = containerRef.current;
    // Excluded from coverage: containerRef.current can only be null during initial render before the ref is attached; this branch is a defensive
    // runtime guard and is not meaningfully reachable in practice
    /* istanbul ignore if */
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const { cardWidth, gap } = applyLayoutToRef(el, itemsPerView, layoutRef);
      setGapPx(gap);
      setCardWidthPx(cardWidth);
    });

    observer.observe(el);

    const onScroll = () => {
      const { cardWidth, gap } = layoutRef.current;
      const step = getStep(cardWidth, gap);
      const rawIndex = Math.round(el.scrollLeft / step);
      const maxIndex = Math.max(0, data.length - itemsPerView);
      setActiveIndex(Math.min(rawIndex, maxIndex));
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    // initial sync
    const { cardWidth, gap } = applyLayoutToRef(el, itemsPerView, layoutRef);
    setGapPx(gap);
    setCardWidthPx(cardWidth);

    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [itemsPerView, data.length]);

  /* Pointer drag (desktop only) */

  useEffect(() => {
    const cleanup = setupPointerHandlers({
      containerRef,
      drag,
      rafRef,
      layoutRef,
      autoplay,
      goToIndex,
    });
    return cleanup;
  }, [itemsPerView]);

  /* Navigation helpers */

  const goToIndex = (index: number) => goToIndexImpl(containerRef.current, layoutRef, index);

  const scrollByCards = (delta: number) =>
    scrollByCardsImpl(containerRef.current, layoutRef, delta, data.length, itemsPerView);

  /* Autoplay */
  const AUTOPLAY_DELAY = 5000;

  const autoplay = useAutoplay(
    () => {
      scrollByCards(1);
    },
    {
      delay: AUTOPLAY_DELAY,
      enabled: true,
    }
  );

  return (
    <div className='relative'>
      <div
        className='relative mx-auto'
        onMouseEnter={autoplay.pause}
        onMouseLeave={autoplay.resume}
        style={{
          maxWidth: itemsPerView * MAX_CARD_WIDTH + gapPx * (itemsPerView - 1) + HOVER_BUFFER * 2,
        }}>
        {/* Left Arrow */}
        {showArrows && (
          <button
            aria-label='Previous'
            aria-hidden={!showArrows}
            onClick={() => scrollByCards(-1)}
            className='hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-primary bg-card border border-primary/20 absolute -left-11 top-1/2 -translate-y-1/2 hover:scale-105 hover:bg-primary/10'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
              focusable='false'>
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>
        )}

        <div
          ref={containerRef}
          tabIndex={0}
          role='region'
          aria-roledescription='carousel'
          aria-label='Projects carousel'
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              autoplay.pause();
              scrollByCards(1);
            }

            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              autoplay.pause();
              scrollByCards(-1);
            }
          }}
          className='carousel-hide-scrollbar flex gap-6 py-6 overflow-x-auto overflow-y-visible touch-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-primary snap-x snap-mandatory'
          style={{ paddingInline: HOVER_BUFFER, scrollPaddingInline: HOVER_BUFFER }}>
          {data.map((d, i) => (
            <div
              key={`${d.title}-${i}`}
              className='snap-start snap-always'
              style={{
                flex: `0 0 ${cardWidthPx}px`,
              }}>
              <ProjectCard {...d} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showArrows && (
          <button
            aria-label='Next'
            aria-hidden={!showArrows}
            onClick={() => scrollByCards(1)}
            className='hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-primary bg-card border border-primary/20 absolute -right-11 top-1/2 -translate-y-1/2 hover:scale-105 hover:bg-primary/10'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
              focusable='false'>
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>
        )}
      </div>

      {/* Dots */}
      {showArrows && (
        <div className='flex justify-center gap-2 mt-4'>
          {Array.from({
            length: Math.max(1, data.length - itemsPerView + 1),
          }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-primary' : 'bg-muted-foreground/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
