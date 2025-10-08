import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Section from "./Section";

const SECTION_ID = "test-section";
const TITLE_TEXT = "Test Section Title";
const CHILD_TEXT = "This is a child element";
const ARIA_LABEL_TEXT = "Test section label";
const HEADING_ID = `${SECTION_ID}-heading`;

describe("Section Component", () => {
  test("renders non-fullHeight Section with title, divider, and proper accessibility", () => {
    render(
      <Section id={SECTION_ID} title={TITLE_TEXT}>
        {CHILD_TEXT}
      </Section>
    );

    expect(screen.getByText(TITLE_TEXT)).toBeVisible();
    expect(screen.getByText(CHILD_TEXT)).toBeVisible();

    const sectionElement = document.getElementById(`${SECTION_ID}-id`);
    expect(sectionElement).toHaveClass("py-20");
    expect(sectionElement).not.toHaveClass("min-h-screen");

    // Should be labeled by the heading

    expect(sectionElement).toHaveAttribute("aria-labelledby", HEADING_ID);
    expect(sectionElement).not.toHaveAttribute("aria-label");

    expect(screen.getByRole("separator", { hidden: true })).toBeVisible();
  });

  test("renders Section with aria-label when no title but ariaLabel provided", () => {
    render(
      <Section id={SECTION_ID} ariaLabel={ARIA_LABEL_TEXT}>
        {CHILD_TEXT}
      </Section>
    );

    expect(screen.getByText(CHILD_TEXT)).toBeVisible();
    expect(screen.queryByText(TITLE_TEXT)).not.toBeInTheDocument();

    // Should use aria-label when no title
    const sectionElement = document.getElementById(`${SECTION_ID}-id`);
    expect(sectionElement).toHaveAttribute("aria-label", ARIA_LABEL_TEXT);
    expect(sectionElement).not.toHaveAttribute("aria-labelledby");

    // Should not create a heading
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders fullHeight Section with relevant classes", () => {
    render(
      <Section id={SECTION_ID} title={TITLE_TEXT} fullHeight>
        {CHILD_TEXT}
      </Section>
    );

    const sectionElement = document.getElementById(`${SECTION_ID}-id`);
    expect(sectionElement).toHaveClass("min-h-screen", "flex", "items-center");
    expect(sectionElement).not.toHaveClass("py-20");

    // Should still have proper accessibility with title

    expect(sectionElement).toHaveAttribute("aria-labelledby", HEADING_ID);
  });

  test("prioritises aria-labelledby over aria-label when both title and ariaLabel provided", () => {
    render(
      <Section id={SECTION_ID} title={TITLE_TEXT} ariaLabel={ARIA_LABEL_TEXT}>
        {CHILD_TEXT}
      </Section>
    );

    const sectionElement = document.getElementById(`${SECTION_ID}-id`);

    // Should use aria-labelledby (title takes priority)
    expect(sectionElement).toHaveAttribute("aria-labelledby", HEADING_ID);
    expect(sectionElement).not.toHaveAttribute("aria-label");
  });
});
