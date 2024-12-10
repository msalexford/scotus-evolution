// SupremeCourtTimeline.jsx

// #region - Imports

import React, { useEffect, useRef, useState, useCallback } from "react";
import Papa from "papaparse";
import * as d3 from "d3";
import {
  processPartyData,
  processPresidentData,
  processJusticeData,
} from "./DataProcessing";
import StreamGraph from "./StreamGraph";
import ScrollySection from "./ScrollySection";
import { DIMENSIONS, SECTIONS, COURT_TIMELINE, STYLE_CONFIG } from "./config";
import _ from "lodash";

// #endregion

// #region - Hooks

// Data loading hook
/**
 * Custom hook to load and parse CSV data for the Supreme Court timeline.
 * @returns {Object} An object containing the parsed data and any error that occurred.
 */
const useDataLoader = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [justicesRes, presidentsRes, sizesRes] = await Promise.all([
          fetch("./data/justices.csv"),
          fetch("./data/presidents.csv"),
          fetch("./data/scotus_size_changes.csv"),
        ]);

        const rawData = {
          justices: Papa.parse(await justicesRes.text(), { header: true }).data,
          presidents: Papa.parse(await presidentsRes.text(), { header: true })
            .data,
          sizes: Papa.parse(await sizesRes.text(), { header: true }).data,
        };

        setData(rawData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err);
      }
    };

    loadData();
  }, []);

  return { data, error };
};

// Data processing hook
/**
 * Custom hook to process the loaded data based on the current step.
 * @param {Object} data - The raw data loaded from CSV files.
 * @param {number} currentStep - The current step in the timeline.
 * @returns {Object} The processed data for the current step.
 */
const useProcessedData = (data, currentStep) => {
  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    if (!data) return;
    const processingFunctions = {
      1: processPartyData,
      2: processPresidentData,
      3: processJusticeData,
    };
    const processFunction =
      processingFunctions[currentStep] || processPartyData;
    setProcessedData(processFunction(data, d3));
  }, [data, currentStep]);

  return processedData;
};

// Scroll observer hook
/**
 * Custom hook to observe scroll position and update the current step.
 * @param {Function} setCurrentStep - Function to update the current step.
 * @returns {React.RefObject} Ref object for the observed elements.
 */
const useScrollObserver = (setCurrentStep) => {
  const observerRefs = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = parseInt(entry.target.dataset.step);
          setCurrentStep(step);
        }
      });
    }, options);

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [setCurrentStep]);

  return observerRefs;
};

// #endregion

// #region - Main Component
/**
 * Main component for the Supreme Court Timeline visualization.
 */
const SupremeCourtTimeline = () => {
  // State declarations
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSequence, setCurrentSequence] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [presidentialStep, setPresidentialStep] = useState(0);
  const containerRef = useRef(null);

  // Custom hook usage
  const { data, error } = useDataLoader();
  const processedData = useProcessedData(data, currentStep);
  const observerRefs = useScrollObserver(setCurrentStep);

  // Tooltip clearing logic
  const clearTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  // Clear tooltip whenever step changes
  useEffect(() => {
    clearTooltip();
  }, [currentStep, clearTooltip]);

  // Scroll handling logic
  useEffect(() => {
    const handleScroll = _.throttle(() => {
      if (currentStep === 1 && containerRef.current) {
        const scrollTop = window.scrollY;
        const containerTop = containerRef.current.offsetTop;
        const sectionHeight = window.innerHeight;
        const relativeScroll = scrollTop - containerTop;

        // Calculate which era we're in
        const sequenceIndex = Math.floor(
          (relativeScroll / (sectionHeight * 1.5)) * COURT_TIMELINE.length
        );

        // Clamp sequence index to valid range
        const newSequence = Math.min(
          COURT_TIMELINE.length - 1,
          Math.max(0, sequenceIndex)
        );

        // Only update if sequence actually changes
        if (newSequence !== currentSequence) {
          console.log("Updating sequence:", newSequence);
          setCurrentSequence(newSequence);
        }
      }
    }, 50); // Throttle to 50ms

    window.addEventListener("scroll", handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentStep, currentSequence]);

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Error loading data. Please try again later.
        </p>
      </div>
    );
  }

  // Render component
  return (
    <div className="supreme-court-timeline">
      <h1 style={STYLE_CONFIG["visualization-title"]}>
        Shaping the Bench: Presidential Influence on the Supreme Court
      </h1>

      <p style={STYLE_CONFIG["visualization-description"]}>
        Explore how presidential appointments have shaped the Supreme Court over
        time, from broad political patterns to individual justices' impact.
        Scroll to uncover the evolving composition of the nation's highest
        court.
      </p>
      <div className="relative" ref={containerRef}>
        <div className="sticky top-0 bg-white z-10 h-screen flex items-center justify-center">
          <div className="relative">
            {processedData && (
              <StreamGraph
                data={processedData}
                width={
                  DIMENSIONS.width +
                  DIMENSIONS.margins.left +
                  DIMENSIONS.margins.right
                }
                height={
                  DIMENSIONS.height +
                  DIMENSIONS.margins.top +
                  DIMENSIONS.margins.bottom
                }
                margins={DIMENSIONS.margins}
                step={currentStep}
                currentSequence={currentSequence}
                clearTooltip={clearTooltip}
              />
            )}
          </div>
        </div>

        <div className="relative z-0">
          {SECTIONS.map((section, index) => (
            <div
              key={section.id}
              ref={(el) => (observerRefs.current[index] = el)}
              data-step={section.id}
              className="min-h-screen flex items-center p-8"
            >
              <ScrollySection
                title={section.title}
                description={section.description}
                step={section.id}
                currentStep={currentStep}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// #endregion

export default SupremeCourtTimeline;
