// StreamGraph.jsx

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as d3 from "d3";
import { STYLE_CONFIG, TIMELINE_DATA } from "./config";
import _ from "lodash";
import ViewTitle from "./ViewTitle";
import UnifiedTimelineAnnotations from "./UnifiedTimelineAnnotations";

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

  const styles = STYLE_CONFIG.tooltip;

  return (
    <div
      ref={tooltipRef}
      className="absolute bg-white rounded shadow-lg text-sm border border-gray-200"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%)",
        padding: `${styles.container.padding.y} ${styles.container.padding.x}`,
        maxWidth: styles.container.maxWidth,
        transition: styles.container.transition,
        zIndex: styles.container.zIndex,
        pointerEvents: "none",
      }}
    >
      <div className="font-bold">{data.name}</div>
      <div className="mt-1" dangerouslySetInnerHTML={{ __html: data.value }} />
    </div>
  );
};

const StreamGraph = ({
  data,
  width,
  height,
  margins,
  step,
  currentSequence,
  modernAnnotationIndex,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const cursorGroupRef = useRef(null);
  const annotationsGroupRef = useRef(null);

  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
      if (!x || !data || !svgRef.current || step === 1 || step === 2) return;

      const [mouseX] = d3.pointer(event);
      const year = Math.round(x.invert(mouseX));
      const yearData = d.find((point) => point.data.year === year);
      if (!yearData) return;

      const justiceCount = Math.round(Math.abs(yearData[1] - yearData[0]));
      const legendItem = data.legendItems.find((item) => item.key === d.key);
      const lastName = legendItem?.label.split(" ").pop() || d.key;

      const tooltipContent = {
        name: legendItem?.label || d.key,
        value: `In ${year}, ${justiceCount} justice${
          justiceCount !== 1 ? "s" : ""
        } serving were appointed by President ${lastName}`,
      };

      const containerBounds = svgRef.current.getBoundingClientRect();
      setTooltipData(tooltipContent);
      setTooltipPosition({
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top,
      });
    },
    [x, data, svgRef, step]
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
        d3.select(cursorGroupRef.current)
          .style("display", "none")
          .selectAll("line")
          .attr("x1", -999)
          .attr("x2", -999);
      }
    };

    clearAllTooltips();
  }, [step]);

  useEffect(() => {
    if (!data?.series || !x || !y || !area) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const baseGroup = svg.append("g").attr("class", "base-layer");
    const streamsGroup = svg.append("g").attr("class", "streams-layer");
    const annotationsGroup = svg.append("g").attr("class", "annotations-layer");
    const interactionGroup = svg.append("g").attr("class", "interaction-layer");

    annotationsGroupRef.current = annotationsGroup;

    const defs = baseGroup.append("defs");
    defs
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margins.left)
      .attr("y", margins.top)
      .attr("width", width - margins.left - margins.right)
      .attr("height", height - margins.top - margins.bottom);

    const paths = streamsGroup
      .attr("clip-path", "url(#clip)")
      .selectAll("path.stream")
      .data(data.series)
      .join("path")
      .attr("class", (d) => {
        console.log("Creating stream for data:", d); // Debug logging
        let className = "stream-path";

        if (step === 2) {
          // For presidential view, use the exact key from the data
          className += ` stream-${d.key}`;
          console.log("Created presidential stream class:", className);
        } else {
          className += ` ${d.key}`;
        }

        return className;
      })
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
      .style("opacity", STYLE_CONFIG.stream.opacity)
      .style(
        "transition",
        `opacity ${STYLE_CONFIG.cursor.interaction.transitionDuration} ease`
      );

    const cursorGroup = interactionGroup
      .append("g")
      .attr("class", "cursor")
      .style("display", "none")
      .attr("pointer-events", "none");

    cursorGroupRef.current = cursorGroup.node();

    cursorGroup
      .append("line")
      .attr("y1", margins.top)
      .attr("y2", height - margins.bottom)
      .attr("stroke", STYLE_CONFIG.cursor.line.stroke)
      .attr("stroke-width", STYLE_CONFIG.cursor.line.strokeWidth)
      .attr("stroke-dasharray", STYLE_CONFIG.cursor.line.strokeDasharray);

    cursorGroup
      .append("text")
      .attr("y", margins.top - 10)
      .attr("text-anchor", STYLE_CONFIG.cursor.label.anchor)
      .attr("font-size", STYLE_CONFIG.cursor.label.fontSize)
      .attr("fill", STYLE_CONFIG.cursor.label.fill);

    interactionGroup
      .attr("clip-path", "url(#clip)")
      .selectAll("path.hover-layer")
      .data(data.series)
      .join("path")
      .attr("class", "hover-layer")
      .attr("d", area)
      .attr("fill", "transparent")
      .style("pointer-events", step === 1 || step === 2 ? "none" : "all")
      .style("cursor", step === 1 || step === 2 ? "default" : "pointer")
      .on("mouseenter", (event, d) => {
        if (step === 1 || step === 2) return;
        setHoveredKey(d.key);
        paths.style("opacity", (p) =>
          p.key === d.key
            ? STYLE_CONFIG.cursor.interaction.activeOpacity
            : STYLE_CONFIG.cursor.interaction.inactiveOpacity
        );
        cursorGroup.style("display", null);
      })
      .on("mousemove", (event, d) => {
        if (step === 1 || step === 2) return;
        const [mouseX] = d3.pointer(event);
        const year = Math.round(x.invert(mouseX));

        cursorGroup.select("line").attr("x1", mouseX).attr("x2", mouseX);
        cursorGroup.select("text").attr("x", mouseX).text(year);

        const yearData = d.find((point) => point.data.year === year);
        if (yearData) {
          const justiceCount = Math.round(Math.abs(yearData[1] - yearData[0]));
          const legendItem = data.legendItems.find(
            (item) => item.key === d.key
          );
          const lastName = legendItem?.label.split(" ").pop() || d.key;

          const tooltipContent = {
            name: legendItem?.label || d.key,
            value: `In ${year}, ${justiceCount} justice${
              justiceCount !== 1 ? "s" : ""
            } serving were appointed by President ${lastName}`,
          };

          const containerBounds = svgRef.current.getBoundingClientRect();
          setTooltipData(tooltipContent);
          setTooltipPosition({
            x: event.clientX - containerBounds.left,
            y: event.clientY - containerBounds.top,
          });
        }
      })
      .on("mouseleave", () => {
        if (step === 1 || step === 2) return;
        setHoveredKey(null);
        setTooltipData(null);
        paths.style("opacity", STYLE_CONFIG.stream.opacity);
        cursorGroup.style("display", "none");
      });

    const xAxis = baseGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margins.bottom})`);

    xAxis.call(d3.axisBottom(x).ticks(12).tickFormat(d3.format("d")));

    xAxis.select(".domain").attr("stroke", "#666").attr("stroke-width", 1);

    xAxis
      .selectAll(".tick line")
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    xAxis
      .selectAll(".tick text")
      .attr("fill", "#666")
      .attr("font-size", STYLE_CONFIG.axis.font.size)
      .attr("font-weight", "400");
  }, [
    data,
    width,
    height,
    margins,
    step,
    x,
    y,
    area,
    setHoveredKey,
    setTooltipData,
  ]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="streamgraph-container"
      />
      {annotationsGroupRef.current && (
        <UnifiedTimelineAnnotations
          step={step}
          currentSequence={currentSequence}
          width={width}
          height={height}
          margins={margins}
          x={x}
          mainGroup={annotationsGroupRef.current}
          modernAnnotationIndex={modernAnnotationIndex}
        />
      )}
      <ViewTitle step={step} margins={margins} />
      {tooltipData && (
        <Tooltip
          data={tooltipData}
          position={tooltipPosition}
          width={width}
          height={height}
        />
      )}
      <p className="text-start text-sm mt-4">Source: U.S. Senate</p>
    </div>
  );
};

export default StreamGraph;
