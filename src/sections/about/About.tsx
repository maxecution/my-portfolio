import { useState, useEffect, useRef } from 'react';
import { aboutData, attributes } from '@data/about/About.data';
import { authorData } from '@data/page/Page.data';
import SectionFade from '@shared/sectionFade/SectionFade';
import useIsMobile from '@hooks/useIsMobile';
import Card from '@shared/card/Card';
import Pill from '@shared/pill/Pill';
import FlipCard from './FlipCard';
import IconWrapper from './IconWrapper';

const tenure = () => {
  return new Date().getFullYear() - new Date('2024-7-15').getFullYear();
};
export default function About() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        } else if (!isMobile) {
          setSectionVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(gridRef.current!);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div>
      {/* Section Header */}
      <SectionFade delay={0.1}>
        <p className='text-muted-foreground max-w-2xl mx-auto mb-12'>{aboutData.sectionHeader}</p>
      </SectionFade>

      {/* Intro Card */}
      <SectionFade delay={0.2}>
        <Card className='xl:max-w-2/3 2xl:max-w-1/2 mx-auto mb-12'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
            <div>
              <h3 className='text-3xl mb-2'>
                {authorData.firstName} <span className='whitespace-nowrap'>{authorData.lastName}</span>
              </h3>
              <div className='flex flex-wrap gap-2'>
                <Pill bg='bg-primary/20' text='text-primary' border='border-primary/30'>
                  Level {tenure().toString()} Developer
                </Pill>
                <Pill bg='bg-secondary/20' text='text-foreground' border='border-secondary/30'>
                  {authorData.jobTitle}
                </Pill>
              </div>
            </div>
          </div>
          <div className='justify-self-center w-2/3 h-px bg-linear-to-r from-transparent via-primary-400 to-transparent my-4' />
          <div className='text-start text-muted-foreground leading-relaxed gap-4 flex flex-col'>
            <p>{aboutData.introCard.paragraph1}</p>
            <p>{aboutData.introCard.paragraph2}</p>
          </div>
        </Card>
      </SectionFade>

      {/* Attributes Grid */}
      <div
        ref={gridRef}
        className='xl:max-w-2/3 2xl:max-w-1/2 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
        {attributes.map((attribute, index) => {
          const isFlipped = flippedCard === attribute.id;

          return (
            <FlipCard
              key={attribute.id}
              flipped={isFlipped}
              onClick={() => setFlippedCard(isFlipped ? null : attribute.id)}
              delay={index * 0.1}
              sectionVisible={sectionVisible}
              front={
                <div className='absolute inset-0 bg-card border-2 border-primary/30 rounded-lg p-6 flex flex-col items-center justify-center'>
                  <div
                    className={`w-16 h-16 mb-4 rounded-full bg-linear-to-br ${attribute.color} flex items-center justify-center drop-shadow-md drop-shadow-foreground/50`}>
                    <IconWrapper size={32} className='text-primary-50 dark:text-foreground'>
                      {attribute.icon}
                    </IconWrapper>
                  </div>
                  <h4 className='text-xl mb-2 text-center text-primary-950 dark:text-foreground'>{attribute.name}</h4>
                  <div className='text-4xl text-primary mb-2'>+{Math.floor((attribute.value - 10) / 2)}</div>
                  <p className='text-muted-foreground text-center'>{attribute.stat}</p>
                  <p className='mt-4 text-xs text-primary/85'>Click to reveal</p>
                </div>
              }
              back={
                <div className='absolute inset-0 bg-card border-2 border-primary/30 rounded-lg p-6 flex flex-col items-center justify-center'>
                  <div
                    className={`w-12 h-12 mb-3 rounded-full bg-linear-to-br ${attribute.color} flex items-center justify-center drop-shadow-md drop-shadow-foreground/50`}>
                    <IconWrapper size={24} className='text-primary-50 dark:text-foreground'>
                      {attribute.icon}
                    </IconWrapper>
                  </div>
                  <h4 className='text-lg mb-3 text-center text-primary'>{attribute.stat}</h4>
                  <p className='text-sm text-muted-foreground text-center leading-relaxed'>{attribute.description}</p>
                  <p className='mt-4 text-xs text-primary/85'>Click to flip back</p>
                </div>
              }
            />
          );
        })}
      </div>

      {/* Bottom decoration */}
      <SectionFade delay={0.2}>
        <div className='text-center'>
          <div className='inline-block px-6 py-3 border border-primary/30 rounded-lg bg-primary/5'>
            <p className='text-sm text-muted-foreground'>
              <span className='text-primary'>Proficiency Bonus:</span> +{(Math.ceil(tenure() / 4) + 1).toString()} to
              all web development checks
            </p>
          </div>
        </div>
      </SectionFade>
    </div>
  );
}
