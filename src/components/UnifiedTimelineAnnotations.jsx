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
  modernAnnotationIndex = -1,
}) => {
  console.log("UnifiedTimelineAnnotations render:", {
    step,
    currentSequence,
    modernAnnotationIndex,
    hasMainGroup: !!mainGroup,
    hasXScale: !!x,
  });

  React.useEffect(() => {
    if (!mainGroup || !x) return;

    // Clear all existing annotations when entering step 3
    if (step === 3) {
      mainGroup.selectAll(".annotation").remove();
      mainGroup.selectAll(".annotation-text").remove();
      mainGroup.selectAll(".annotation-line").remove();
      mainGroup.selectAll(".era-highlight").remove();
      mainGroup.selectAll(".boundary-line").remove();
      return;
    }

    const timeline =
      step === 1 ? TIMELINE_DATA.court : TIMELINE_DATA.presidential;
    const currentEra = timeline.eras[currentSequence];

    if (!currentEra) return;

    if (step === 1) {
      // Clear only existing annotations for step 1
      mainGroup.selectAll(".annotation").remove();

      // Party view - single year annotations
      if (currentEra.annotations && currentEra.annotations.length > 0) {
        currentEra.annotations.forEach((annotation) => {
          const annotationGroup = mainGroup
            .append("g")
            .attr("class", "annotation")
            .attr("transform", `translate(${x(annotation.year)},0)`);

          // Add vertical line
          annotationGroup
            .append("line")
            .attr("y1", margins.top)
            .attr("y2", height - margins.bottom)
            .attr("stroke", "black")
            .attr("stroke-width", "1.5")
            .attr("opacity", 0.8);

          // Add label group
          const labelGroup = annotationGroup
            .append("g")
            .attr("transform", `translate(0,${margins.top - 40})`);

          // Background
          labelGroup
            .append("rect")
            .attr("x", -100)
            .attr("y", -20)
            .attr("width", 200)
            .attr("height", 45)
            .attr("fill", "white")
            .attr("opacity", 0.9);

          // Label
          labelGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text(annotation.label);

          // Description
          labelGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "20")
            .attr("font-size", "12px")
            .text(annotation.description);
        });
      }
    } else if (step === 2) {
      // Clear everything for step 2
      mainGroup.selectAll(".annotation-text").remove();
      mainGroup.selectAll(".annotation-line").remove();
      mainGroup.selectAll(".era-highlight").remove();
      mainGroup.selectAll(".boundary-line").remove();

      const [startYear, endYear] = currentEra.period;

      // Create highlight for current era
      const highlightGroup = mainGroup
        .append("g")
        .attr("class", "era-highlight");

      // Add semi-transparent overlays
      highlightGroup
        .append("rect")
        .attr("x", margins.left)
        .attr("y", margins.top)
        .attr("width", x(startYear) - margins.left)
        .attr("height", height - margins.top - margins.bottom)
        .attr("fill", "white")
        .attr("opacity", 0.5);

      highlightGroup
        .append("rect")
        .attr("x", x(endYear))
        .attr("y", margins.top)
        .attr("width", width - x(endYear) - margins.right)
        .attr("height", height - margins.top - margins.bottom)
        .attr("fill", "white")
        .attr("opacity", 0.5);

      // Add boundary lines
      [startYear, endYear].forEach((year) => {
        const lineGroup = mainGroup
          .append("g")
          .attr("class", "boundary-line")
          .attr("transform", `translate(${x(year)},0)`);

        lineGroup
          .append("line")
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", STYLE_CONFIG.eraLines.background.stroke)
          .attr("stroke-width", STYLE_CONFIG.eraLines.background.strokeWidth)
          .attr("opacity", STYLE_CONFIG.eraLines.background.opacity);

        lineGroup
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
      });

      const isModernEra = currentEra.id === "modern-politics";

      if (
        isModernEra &&
        modernAnnotationIndex >= 0 &&
        currentEra?.annotations
      ) {
        const currentAnnotation = currentEra.annotations[modernAnnotationIndex];

        const annotationGroup = mainGroup
          .append("g")
          .attr("class", "annotation-text")
          .attr("transform", `translate(${x(currentAnnotation.year)},0)`);

        // Add line
        annotationGroup
          .append("line")
          .attr("class", "annotation-line")
          .attr("y1", margins.top)
          .attr("y2", height - margins.bottom)
          .attr("stroke", "black")
          .attr("stroke-width", "2")
          .attr("opacity", 0.8);

        // Add label group
        const labelGroup = annotationGroup
          .append("g")
          .attr("transform", `translate(0,${margins.top - 40})`);

        // Background
        labelGroup
          .append("rect")
          .attr("x", -100)
          .attr("y", -20)
          .attr("width", 200)
          .attr("height", 45)
          .attr("fill", "white")
          .attr("opacity", 0.9);

        // Label
        labelGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .text(currentAnnotation.label);

        // Description
        labelGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "20")
          .attr("font-size", "12px")
          .text(currentAnnotation.description);
      } else if (!isModernEra) {
        // Non-modern era title and description
        const annotationGroup = mainGroup
          .append("g")
          .attr("class", "annotation-text")
          .attr(
            "transform",
            `translate(${x(startYear + (endYear - startYear) / 2)},0)`
          );

        const textConfig = STYLE_CONFIG.annotations.text;

        // Title
        annotationGroup
          .append("text")
          .attr("y", margins.top + textConfig.label.y)
          .attr("text-anchor", "middle")
          .attr("font-size", textConfig.label.fontSize)
          .attr("fill", textConfig.label.fill)
          .attr("font-weight", textConfig.label.fontWeight)
          .text(currentEra.name);

        // Description
        annotationGroup
          .append("text")
          .attr("y", margins.top + textConfig.description.y)
          .attr("text-anchor", "middle")
          .attr("font-size", textConfig.description.fontSize)
          .attr("fill", textConfig.description.fill)
          .attr("font-weight", textConfig.description.fontWeight)
          .text(currentEra.description);
      }
    }
  }, [
    step,
    currentSequence,
    width,
    height,
    margins,
    x,
    mainGroup,
    modernAnnotationIndex,
  ]);

  return null;
};

export default UnifiedTimelineAnnotations;
