// StreamGraph.jsx

// #region - Imports

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as d3 from "d3";
import { STYLE_CONFIG, ANNOTATIONS, COURT_TIMELINE } from "./config";
import _ from "lodash";

// #endregion

// Tooltip component for displaying hover information
const Tooltip = ({ data, position, width, height }) => {
  const tooltipRef = useRef(null);
  const tooltip = tooltipRef.current?.getBoundingClientRect();

  let x = position.x;
  let y = position.y - 10;

  if (tooltip) {
    if (x + tooltip.width / 2 > width) x = width - tooltip.width / 2;
    if (x - tooltip.width / 2 < 0) x = tooltip.width / 2;
    if (y - tooltip.height < 0) y = position.y + tooltip.height;
  }

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white px-3 py-2 rounded shadow-lg text-sm border border-gray-200"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
        maxWidth: "300px",
        transition: "all 50ms ease-out",
        pointerEvents: "none",
      }}
    >
      <div className="font-bold">{data.name}</div>
      <div className="mt-1" dangerouslySetInnerHTML={{ __html: data.value }} />
    </div>
  );
};

// Create streamgraph
const StreamGraph = ({
  data,
  width,
  height,
  margins,
  step,
  currentSequence,
  clearTooltip,
}) => {
  const svgRef = useRef(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cursorGroupRef = useRef(null);

  const { x, y, area } = useMemo(() => {
    if (!data?.series) return {};

    const x = d3
      .scaleLinear()
      .domain([1789, 2024])
      .range([margins.left, width - margins.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data.series, (d) => d3.min(d, (d) => d[0])),
        d3.max(data.series, (d) => d3.max(d, (d) => d[1])),
      ])
      .range([height - margins.bottom, margins.top]);

    const area = d3
      .area()
      .x((d) => x(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    return { x, y, area };
  }, [data, width, height, margins]);

  const handleMouseMove = useCallback(
    (event, d) => {
      if (!x || !data) return;

      const [mouseX] = d3.pointer(event);
      const year = Math.round(x.invert(mouseX));
      const bisect = d3.bisector((point) => point.data.year).left;
      const yearIndex = bisect(d, year);

      if (yearIndex < 0 || yearIndex >= d.length) return;

      const yearData = d[yearIndex];
      if (!yearData) return;

      let displayName, displayValue;

      switch (step) {
        case 1: {
          const partyName = d.key.charAt(0).toUpperCase() + d.key.slice(1);
          displayName = year.toString();
          const value = yearData[1] - yearData[0];
          const courtSize = yearData.data.total || 9;
          const partyJustices = Math.round(Math.abs(value) * courtSize);
          displayValue = `${partyJustices} out of ${courtSize} justices nominated by ${partyName} presidents`;
          break;
        }
        case 2: {
          const legendItem = data.legendItems.find(
            (item) => item.key === d.key
          );
          const fullName = legendItem ? legendItem.label : d.key;
          displayName = fullName;
          const value = yearData[1] - yearData[0];
          const justiceCount = Math.abs(value);
          const lastName = fullName.split(" ").pop();
          const clevelandNote =
            lastName === "Cleveland"
              ? " (Note: Shows combined appointees from two non-consecutive terms 1885-1889 and 1893-1897)"
              : "";
          displayValue =
            justiceCount === 0
              ? `In ${year}, no justices serving were appointed by President ${lastName}${clevelandNote}`
              : `In ${year}, there were ${justiceCount} justice${
                  justiceCount !== 1 ? "s" : ""
                } serving appointed by President ${lastName}${clevelandNote}`;
          break;
        }
        case 3: {
          const justiceInfo = data.legendItems.find(
            (item) => item.key === d.key
          );
          if (!justiceInfo) return;
          displayName = justiceInfo.label;
          const endYear = justiceInfo.endYear || "Present";
          displayValue = `${justiceInfo.startYear}–${endYear}`;
          break;
        }
      }

      const bounds = event.target.getBoundingClientRect();
      const containerBounds = svgRef.current.getBoundingClientRect();

      setTooltipData({
        name: displayName,
        value: displayValue,
      });

      setTooltipPosition({
        x: event.clientX - containerBounds.left,
        y: Math.min(
          event.clientY - containerBounds.top,
          bounds.top - containerBounds.top
        ),
      });
    },
    [x, data, step]
  );

  const debouncedHandleMouseMove = useMemo(
    () => _.debounce((event, d) => handleMouseMove(event, d), 16),
    [handleMouseMove]
  );

  useEffect(() => {
    const clearAllTooltips = () => {
      setHoveredKey(null);
      setTooltipData(null);
      if (svgRef.current) {
        const paths = d3.select(svgRef.current).selectAll("path.stream");
        paths.style("opacity", STYLE_CONFIG.stream.opacity);
      }
      if (cursorGroupRef.current) {
        d3.select(cursorGroupRef.current).style("display", "none");
      }
    };

    clearAllTooltips();
  }, [step]);

  useEffect(() => {
    if (!data?.series || !x || !y || !area) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create separate groups for different layers
    const baseGroup = svg.append("g").attr("class", "base-layer");
    const streamsGroup = svg.append("g").attr("class", "streams-layer");
    const annotationsGroup = svg.append("g").attr("class", "annotations-layer");
    const interactionGroup = svg.append("g").attr("class", "interaction-layer");

    // Setup SVG structure with proper layering
    const defs = baseGroup.append("defs");
    defs
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margins.left)
      .attr("y", margins.top)
      .attr("width", width - margins.left - margins.right)
      .attr("height", height - margins.top - margins.bottom);

    // Draw streams in the streams layer
    const paths = streamsGroup
      .attr("clip-path", "url(#clip)")
      .selectAll("path.stream")
      .data(data.series)
      .join("path")
      .attr("class", (d) => `stream-path ${d.key}`)
      .attr("d", area)
      .attr("fill", (d) => data.colors[d.key])
      .attr("stroke", STYLE_CONFIG.stream.stroke.color)
      .attr(
        "stroke-width",
        step === 3
          ? STYLE_CONFIG.stream.stroke.width.justice
          : STYLE_CONFIG.stream.stroke.width.default
      )
      .attr("stroke-opacity", STYLE_CONFIG.stream.stroke.opacity)
      .attr("stroke-linejoin", STYLE_CONFIG.stream.stroke.join)
      .attr("stroke-linecap", STYLE_CONFIG.stream.stroke.cap)
      .style("opacity", STYLE_CONFIG.stream.opacity);

    // Add highlights and annotations in the annotations layer
    if (step === 1 && COURT_TIMELINE[currentSequence]) {
      const currentEra = COURT_TIMELINE[currentSequence];
      if (currentEra?.period) {
        const [start, end] = currentEra.period;

        // Add white background for annotation lines first
        COURT_TIMELINE.forEach((era) => {
          if (!era.period) return;
          const [eraStart] = era.period;

          // Line
          annotationsGroup
            .append("line")
            .attr("class", "era-line")
            .attr("x1", x(eraStart))
            .attr("x2", x(eraStart))
            .attr("y1", margins.top)
            .attr("y2", height - margins.bottom)
            .attr("stroke", "#000000") // Changed from black to gray
            .attr("stroke-width", 1) // Reduced from 2
            .attr("stroke-dasharray", "5,3") // Smaller dash pattern
            .attr("opacity", era === currentEra ? 0.8 : 0.4); // Reduced opacity
        });

        // Add annotations with enhanced visibility
        const relevantAnnotations =
          ANNOTATIONS[step]?.filter(
            (anno) => anno.year >= start && anno.year <= end
          ) || [];

        relevantAnnotations.forEach((annotation) => {
          const annotationGroup = annotationsGroup
            .append("g")
            .attr("class", "annotation")
            .attr("transform", `translate(${x(annotation.year)},0)`);

          // White background line
          annotationGroup
            .append("line")
            .attr("y1", margins.top)
            .attr("y2", height - margins.bottom)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 6)
            .attr("opacity", 0.5);

          // Black foreground line
          annotationGroup
            .append("line")
            .attr("y1", margins.top)
            .attr("y2", height - margins.bottom)
            .attr("stroke", "#000000")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "5,3")
            .attr("opacity", 1);

          // Text with background
          const addText = (text, yPos, fontSize, isBold = false) => {
            // White text background
            annotationGroup
              .append("text")
              .attr("y", yPos)
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
              .attr("y", yPos)
              .attr("text-anchor", "middle")
              .attr("font-size", fontSize)
              .attr("font-weight", isBold ? "bold" : "normal")
              .attr("fill", "#000000")
              .text(text);
          };

          addText(annotation.label, margins.top - 12, "13px", true);
          if (annotation.description) {
            addText(annotation.description, margins.top - 28, "11px");
          }
        });
      }
    }

    // Add cursor group for hover effects
    const cursorGroup = svg
      .append("g")
      .attr("class", "cursor")
      .style("display", "none");

    cursorGroupRef.current = cursorGroup.node();

    cursorGroup
      .append("line")
      .attr("y1", margins.top)
      .attr("y2", height - margins.bottom)
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    cursorGroup
      .append("text")
      .attr("y", margins.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#666");

    // Add interaction layer on top
    interactionGroup
      .attr("clip-path", "url(#clip)")
      .selectAll("path.hover-layer")
      .data(data.series)
      .join("path")
      .attr("class", "hover-layer")
      .attr("d", area)
      .attr("fill", "transparent")
      .style("pointer-events", step === 1 ? "none" : "all")
      .style("cursor", step === 1 ? "default" : "pointer")
      .on("mouseenter", (event, d) => {
        if (step === 1) return;
        setHoveredKey(d.key);
        paths.style("opacity", (p) => (p.key === d.key ? 1 : 0.2));
        handleMouseMove(event, d);
        cursorGroup.style("display", null);
      })
      .on("mousemove", (event, d) => {
        if (step === 1) return;
        debouncedHandleMouseMove(event, d);
        const [mouseX] = d3.pointer(event);
        cursorGroup.select("line").attr("x1", mouseX).attr("x2", mouseX);
        cursorGroup
          .select("text")
          .attr("x", mouseX)
          .text(Math.round(x.invert(mouseX)));
      })
      .on("mouseleave", () => {
        if (step === 1) return;
        setHoveredKey(null);
        setTooltipData(null);
        paths.style("opacity", STYLE_CONFIG.stream.opacity);
        cursorGroup.style("display", "none");
      });

    // Add x-axis at the bottom
    baseGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margins.bottom})`)
      // ... previous code ...

      .call(d3.axisBottom(x).ticks(12).tickFormat(d3.format("d")));
  }, [
    data,
    width,
    height,
    margins,
    step,
    x,
    y,
    area,
    currentSequence,
    debouncedHandleMouseMove,
    handleMouseMove,
  ]);

  return (
    <div className="relative w-full">
      {/* Main SVG container */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="streamgraph-container"
      />

      {/* Render tooltip when tooltip data exists */}
      {tooltipData && (
        <Tooltip
          data={tooltipData}
          position={tooltipPosition}
          width={width}
          height={height}
        />
      )}

      {/* Information overlay for step 1 */}
      {step === 1 && COURT_TIMELINE[currentSequence] && (
        <div className="absolute left-0 right-0 bottom-0 p-4 bg-white bg-opacity-90">
          <p className="text-lg font-bold">
            {COURT_TIMELINE[currentSequence].name}
          </p>
          <p className="text-gray-700">
            {COURT_TIMELINE[currentSequence].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StreamGraph;
