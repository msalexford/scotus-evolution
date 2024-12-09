import React, { useEffect, useMemo } from "react";
import { COURT_TIMELINE, ANNOTATIONS } from "./config";

const TimelineAnnotations = ({
  step,
  currentSequence,
  width,
  height,
  margins,
  x,
  mainGroup,
}) => {
  // Memoize active annotations based on current view
  const activeAnnotations = useMemo(() => {
    switch (step) {
      case 1: // Party View
        return ANNOTATIONS.partyView.filter((annotation) => {
          const era = COURT_TIMELINE[currentSequence];
          return era
            ? annotation.year >= era.period[0] &&
                annotation.year <= era.period[1]
            : true;
        });
      case 2: // Presidential View
        const era = COURT_TIMELINE.find((era) => era.step === currentSequence);
        return ANNOTATIONS.presidentialView.filter((annotation) =>
          era
            ? annotation.year >= era.period[0] &&
              annotation.year <= era.period[1]
            : true
        );
      case 3: // Justice View
        return ANNOTATIONS.justiceView;
      default:
        return [];
    }
  }, [step, currentSequence]);

  // Add era boundaries
  const addEraBoundaries = () => {
    COURT_TIMELINE.forEach((era) => {
      if (!era.period) return;
      const [start, end] = era.period;

      // Add vertical lines at era boundaries
      mainGroup
        .append("line")
        .attr("class", "era-boundary")
        .attr("x1", x(start))
        .attr("x2", x(start))
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", step === 1 ? 0.3 : 0.15);

      // Add era labels if in appropriate view
      if (step === 2) {
        mainGroup
          .append("text")
          .attr("class", "era-label")
          .attr("x", x(start))
          .attr("y", margins.top - 25)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#666")
          .text(era.name);
      }
    });
  };

  // Add event annotations
  const addEventAnnotations = () => {
    const annotationGroup = mainGroup.append("g").attr("class", "annotations");

    activeAnnotations.forEach((annotation) => {
      const group = annotationGroup
        .append("g")
        .attr("class", "annotation")
        .attr("transform", `translate(${x(annotation.year)},0)`);

      // Annotation line
      group
        .append("line")
        .attr("y1", margins.top)
        .attr("y2", height - margins.bottom)
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4");

      // Event label
      group
        .append("text")
        .attr("y", margins.top - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#666")
        .text(annotation.label);

      // Year label
      group
        .append("text")
        .attr("y", margins.top - 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#666")
        .text(annotation.year);

      // Description tooltip (on hover)
      if (annotation.description) {
        const tooltip = group
          .append("g")
          .attr("class", "annotation-tooltip")
          .style("opacity", 0)
          .attr("pointer-events", "none");

        tooltip
          .append("rect")
          .attr("x", -100)
          .attr("y", margins.top - 60)
          .attr("width", 200)
          .attr("height", 30)
          .attr("rx", 5)
          .attr("fill", "white")
          .attr("stroke", "#666");

        tooltip
          .append("text")
          .attr("x", 0)
          .attr("y", margins.top - 40)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#666")
          .text(annotation.description);

        group
          .on("mouseenter", () => {
            tooltip.transition().duration(200).style("opacity", 1);
          })
          .on("mouseleave", () => {
            tooltip.transition().duration(200).style("opacity", 0);
          });
      }
    });
  };

  useEffect(() => {
    if (!mainGroup || !x) return;

    // Clear existing annotations
    mainGroup.selectAll(".era-boundary, .era-label, .annotations").remove();

    // Add new annotations
    addEraBoundaries();
    addEventAnnotations();
  }, [step, currentSequence, width, height, margins, x, mainGroup]);

  return null;
};

export default TimelineAnnotations;
