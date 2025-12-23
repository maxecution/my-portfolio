export default function getScreenshot(projectTitle: string) {
  const normalisedProjectName = projectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `/projectScreenshots/${normalisedProjectName}-screenshot.png`;
}
