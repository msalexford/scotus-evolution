// StepTransitions.jsx

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { COURT_TIMELINE, ANNOTATIONS } from "./config";

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

    // Get current era data
    const currentEra = COURT_TIMELINE[currentSequence];
    if (!currentEra?.period) return;

    const [start, end] = currentEra.period;

    // Add era boundaries with significantly enhanced visibility
    COURT_TIMELINE.forEach((era) => {
      if (!era.period) return;
      const [eraStart] = era.period;

      // Enhanced line styles with much higher contrast
      const lineOpacity =
        step === 1
          ? era === currentEra
            ? 1
            : 0.85 // Further increased opacity
          : step === 2
          ? era.step === currentSequence
            ? 1
            : 0.8
          : 0.8;

      // Add white background line first
      mainGroup
        .append("line")
        .attr("class", "era-line-bg")
        .attr("x1", x(eraStart))
        .attr("x2", x(eraStart))
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 6) // Much thicker white background
        .attr("opacity", 0.9);

      mainGroup
        .append("line")
        .attr("class", "era-line")
        .attr("x1", x(eraStart))
        .attr("x2", x(eraStart))
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", "#000000") // Changed to black for maximum contrast
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "8,4") // Adjusted dash pattern
        .attr("opacity", lineOpacity)
        .attr("filter", "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))");

      // Add era labels for step 2 with enhanced visibility
      if (step === 2 && era.step === currentSequence) {
        // Add text background for better readability
        mainGroup
          .append("text")
          .attr("class", "era-label-bg")
          .attr("x", x(eraStart + (era.period[1] - eraStart) / 2))
          .attr("y", margins.top - 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 6)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .text(era.name);

        mainGroup
          .append("text")
          .attr("class", "era-label")
          .attr("x", x(eraStart + (era.period[1] - eraStart) / 2))
          .attr("y", margins.top - 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .attr("fill", "#000000") // Changed to black
          .text(era.name);
      }
    });

    // Add annotations with significantly enhanced visibility
    const relevantAnnotations = ANNOTATIONS[step] || [];
    relevantAnnotations
      .filter((annotation) => {
        if (step === 1) {
          return annotation.year >= start && annotation.year <= end;
        }
        return true;
      })
      .forEach((annotation) => {
        const annotationGroup = mainGroup
          .append("g")
          .attr("class", "annotation")
          .attr("transform", `translate(${x(annotation.year)},0)`);

        // Add thick white background line
        annotationGroup
          .append("line")
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 6)
          .attr("opacity", 0.9);

        // Add main annotation line with maximum contrast
        annotationGroup
          .append("line")
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", "#000000") // Changed to black
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "8,4")
          .attr("opacity", 1);

        // Add text background for better readability
        ["label", "description"].forEach((textType) => {
          if (textType === "description" && !annotation.description) return;

          const y = textType === "label" ? margins.top - 12 : margins.top - 28;
          const text =
            textType === "label" ? annotation.label : annotation.description;
          const fontSize = textType === "label" ? "13px" : "11px";

          // White background for text
          annotationGroup
            .append("text")
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSize)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 4)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .text(text);

          // Main text
          annotationGroup
            .append("text")
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSize)
            .attr("font-weight", textType === "label" ? "bold" : "normal")
            .attr("fill", "#000000") // Changed to black
            .text(text);
        });
      });
  }, [step, currentSequence, width, height, margins, x, mainGroup]);

  return null;
};

export default StepTransitions;
