import { projectIntro, projectsData } from '@data/projects/Projects.data';
import SectionFade from '@shared/sectionFade/SectionFade';
// import ProjectCard from './ProjectCard';
import Carousel from './Carousel';

export default function Projects() {
  return (
    <div>
      {/* Section Header */}
      <SectionFade delay={0.1} direction='top-down'>
        <p className='text-muted-foreground max-w-2xl mx-auto mb-12'>{projectIntro.sectionHeader}</p>
      </SectionFade>

      <SectionFade delay={0.2} direction='bottom-up'>
        <Carousel data={projectsData} />
      </SectionFade>
    </div>
  );
}
