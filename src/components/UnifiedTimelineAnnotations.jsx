// UnifiedTimelineAnnotations.jsx
import React from "react";
import { STYLE_CONFIG, TIMELINE_DATA } from "./config";

const UnifiedTimelineAnnotations = ({
  step,
  currentSequence,
  width,
  height,
  margins,
  x,
  mainGroup,
}) => {
  React.useEffect(() => {
    if (!mainGroup || !x) return;

    // Clear existing annotations
    const clearAnnotations = () => {
      mainGroup.selectAll(".annotation").remove();
      mainGroup.selectAll(".annotation-text").remove();
      mainGroup.selectAll(".legacy-highlight").remove();
    };

    clearAnnotations();

    // Handle party view (step 1)
    if (step === 1 && TIMELINE_DATA.court?.eras?.[currentSequence]) {
      const currentEra = TIMELINE_DATA.court.eras[currentSequence];

      // Process each annotation for the current era
      currentEra.annotations?.forEach((annotation) => {
        // Create annotation group
        const annotationGroup = mainGroup
          .append("g")
          .attr("class", "annotation")
          .attr("transform", `translate(${x(annotation.year)},0)`);

        // Add background line (white backdrop for visibility)
        annotationGroup
          .append("line")
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", STYLE_CONFIG.eraLines.background.stroke)
          .attr("stroke-width", STYLE_CONFIG.eraLines.background.strokeWidth)
          .attr("opacity", STYLE_CONFIG.eraLines.background.opacity);

        // Add main vertical line
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

        // Add text background for better readability
        const labelGroup = annotationGroup
          .append("g")
          .attr("class", "label-group")
          .attr("transform", `translate(0,${margins.top - 40})`);

        // Add label
        labelGroup
          .append("text")
          .attr("class", "annotation-label")
          .attr("text-anchor", "middle")
          .attr("font-size", STYLE_CONFIG.annotations.text.label.fontSize)
          .attr("font-weight", STYLE_CONFIG.annotations.text.label.fontWeight)
          .attr("fill", STYLE_CONFIG.annotations.text.label.fill)
          .attr("y", 0)
          .text(annotation.label);

        // Add description
        labelGroup
          .append("text")
          .attr("class", "annotation-description")
          .attr("text-anchor", "middle")
          .attr("font-size", STYLE_CONFIG.annotations.text.description.fontSize)
          .attr(
            "font-weight",
            STYLE_CONFIG.annotations.text.description.fontWeight
          )
          .attr("fill", STYLE_CONFIG.annotations.text.description.fill)
          .attr("y", 20)
          .text(annotation.description);
      });
    }

    // Handle presidential legacies (step 2)
    else if (step === 2 && currentSequence >= 0) {
      const legacy = TIMELINE_DATA.presidential.legacies?.[currentSequence];
      if (!legacy) return;

      const [startYear, endYear] = legacy.period || [];
      if (!startYear || !endYear) return;

      // Add subtle period indicator
      mainGroup
        .append("rect")
        .attr("class", "legacy-background")
        .attr("x", x(startYear))
        .attr("y", margins.top)
        .attr("width", x(endYear) - x(startYear))
        .attr("height", height - margins.top - margins.bottom)
        .attr("fill", "#f8f9fa")
        .attr("opacity", 0.15);

      // Add period boundary lines
      [startYear, endYear].forEach((year) => {
        mainGroup
          .append("line")
          .attr("class", "period-boundary")
          .attr("x1", x(year))
          .attr("x2", x(year))
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", STYLE_CONFIG.annotations.line.standard.stroke)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4,4")
          .attr("opacity", 0.4);
      });

      // Add title group
      const titleGroup = mainGroup
        .append("g")
        .attr("class", "annotation-text")
        .attr(
          "transform",
          `translate(${x(startYear + (endYear - startYear) / 2)},${
            margins.top - 40
          })`
        );

      // Add title text
      titleGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", STYLE_CONFIG.annotations.text.label.fontSize)
        .attr("font-weight", STYLE_CONFIG.annotations.text.label.fontWeight)
        .attr("fill", STYLE_CONFIG.annotations.text.label.fill)
        .attr("dy", "-8")
        .text(legacy.name);

      // Add description text
      titleGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "20")
        .attr("font-size", STYLE_CONFIG.annotations.text.description.fontSize)
        .attr(
          "font-weight",
          STYLE_CONFIG.annotations.text.description.fontWeight
        )
        .attr("fill", STYLE_CONFIG.annotations.text.description.fill)
        .text(legacy.description);

      // Add period text
      titleGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "35")
        .attr("font-size", "12px")
        .attr("fill", "#666")
        .text(`${startYear}–${endYear}`);

      // Add drop shadow filter
      const defs = mainGroup.append("defs");
      defs
        .append("filter")
        .attr("id", "shadow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%")
        .append("feDropShadow")
        .attr("dx", "0")
        .attr("dy", "2")
        .attr("stdDeviation", "3")
        .attr("flood-color", "rgba(0,0,0,0.1)");
    }
  }, [step, currentSequence, width, height, margins, x, mainGroup]);

  return null;
};

export default UnifiedTimelineAnnotations;
