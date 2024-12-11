// StepTransitions.jsx

// #region - Imports

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { TIMELINE_DATA } from "./config";
import { STYLE_CONFIG } from "./config";

// #endregion

const StepTransitions = ({
  step,
  currentSequence,
  width,
  height,
  margins,
  x,
  mainGroup,
}) => {
  useEffect(() => {
    if (!mainGroup || !x) return;

    // Clear existing highlights
    mainGroup.selectAll(".highlight-region, .era-line, .annotation").remove();

    // Get timeline data based on step
    const timeline =
      step === 1 ? TIMELINE_DATA.court : TIMELINE_DATA.presidential;
    const currentEra = timeline.eras[currentSequence];
    if (!currentEra?.period) return;

    const [start, end] = currentEra.period;

    // Add era boundaries
    timeline.eras.forEach((era) => {
      if (!era.period) return;
      const [eraStart] = era.period;
      const isCurrentEra = era === currentEra;

      // Add white background line
      mainGroup
        .append("line")
        .attr("class", "era-line-bg")
        .attr("x1", x(eraStart))
        .attr("x2", x(eraStart))
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", STYLE_CONFIG.eraLines.background.stroke)
        .attr("stroke-width", STYLE_CONFIG.eraLines.background.strokeWidth)
        .attr("opacity", STYLE_CONFIG.eraLines.background.opacity);

      // Add era line
      mainGroup
        .append("line")
        .attr("class", "era-line")
        .attr("x1", x(eraStart))
        .attr("x2", x(eraStart))
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr(
          "stroke",
          isCurrentEra
            ? STYLE_CONFIG.eraLines.highlighted.stroke
            : STYLE_CONFIG.eraLines.standard.stroke
        )
        .attr(
          "stroke-width",
          isCurrentEra
            ? STYLE_CONFIG.eraLines.highlighted.strokeWidth
            : STYLE_CONFIG.eraLines.standard.strokeWidth
        )
        .attr(
          "stroke-dasharray",
          isCurrentEra
            ? STYLE_CONFIG.eraLines.highlighted.strokeDasharray
            : STYLE_CONFIG.eraLines.standard.strokeDasharray
        )
        .attr(
          "opacity",
          isCurrentEra
            ? STYLE_CONFIG.eraLines.highlighted.opacity
            : STYLE_CONFIG.eraLines.standard.opacity
        );
    });

    // Add annotations from the current era
    currentEra.annotations.forEach((annotation) => {
      const annotationGroup = mainGroup
        .append("g")
        .attr("class", "annotation")
        .attr("transform", `translate(${x(annotation.year)},0)`);

      // Add thick white background line
      annotationGroup
        .append("line")
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", STYLE_CONFIG.eraLines.background.stroke)
        .attr("stroke-width", STYLE_CONFIG.eraLines.background.strokeWidth)
        .attr("opacity", STYLE_CONFIG.eraLines.background.opacity);

      // Add main annotation line
      annotationGroup
        .append("line")
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", STYLE_CONFIG.eraLines.highlighted.stroke)
        .attr("stroke-width", STYLE_CONFIG.eraLines.highlighted.strokeWidth)
        .attr(
          "stroke-dasharray",
          STYLE_CONFIG.eraLines.highlighted.strokeDasharray
        )
        .attr("opacity", STYLE_CONFIG.eraLines.highlighted.opacity);

      // Add text with background
      ["label", "description"].forEach((textType) => {
        if (textType === "description" && !annotation.description) return;

        const y = textType === "label" ? margins.top - 12 : margins.top - 28;
        const text =
          textType === "label" ? annotation.label : annotation.description;
        const textStyles = STYLE_CONFIG.annotationText[textType];

        // White background for text
        annotationGroup
          .append("text")
          .attr("y", y)
          .attr("text-anchor", textStyles.anchor)
          .attr("font-size", textStyles.fontSize)
          .attr("stroke", STYLE_CONFIG.eraLines.background.stroke)
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .text(text);

        // Main text
        annotationGroup
          .append("text")
          .attr("y", y)
          .attr("text-anchor", textStyles.anchor)
          .attr("font-size", textStyles.fontSize)
          .attr("font-weight", textStyles.fontWeight)
          .attr("fill", textStyles.fill)
          .text(text);
      });
    });
  }, [step, currentSequence, width, height, margins, x, mainGroup]);

  return null;
};

export default StepTransitions;
