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
import { DIMENSIONS, SECTIONS, TIMELINE_DATA, STYLE_CONFIG } from "./config";
import _ from "lodash";

// Custom hooks
const useDataLoader = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [justicesRes, presidentsRes, sizesRes] = await Promise.all([
          fetch("/scotus-evolution/data/justices.csv"),
          fetch("/scotus-evolution/data/presidents.csv"),
          fetch("/scotus-evolution/data/scotus_size_changes.csv"),
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

const useProcessedData = (data, step) => {
  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    if (!data) return;
    const processingFunctions = {
      1: processPartyData,
      2: processPresidentData,
      3: processJusticeData,
    };
    const processFunction = processingFunctions[step] || processPartyData;
    setProcessedData(processFunction(data, d3));
  }, [data, step]);

  return processedData;
};

// Main component
const SupremeCourtTimeline = () => {
  // State declarations
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSequence, setCurrentSequence] = useState(-1); // Start with no annotations
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const containerRef = useRef(null);
  const observerRefs = useRef([]);

  // Custom hook usage
  const { data, error } = useDataLoader();
  const processedData = useProcessedData(
    data,
    getVisualizationStep(currentStep)
  );

  // Helper function to determine which visualization to show (1 or 2)
  function getVisualizationStep(step) {
    // Modify step ranges to include step 3
    if (step >= 1 && step <= 5) {
      return 1; // First visualization (party view)
    } else if (step >= 6 && step <= 10) {
      return 2; // Second visualization (presidential eras)
    } else if (step >= 11 && step <= 13) {
      return 3; // Third visualization (individual justices)
    }
    return 1; // Default to first visualization
  }

  // Update the getAnnotationSequence function
  function getAnnotationSequence(step) {
    if (step >= 1 && step <= 5) {
      return step - 1; // First viz annotations (0-4)
    } else if (step >= 6 && step <= 10) {
      return step - 6; // Pre-modern era annotations (0-4)
    } else if (step >= 11 && step <= 13) {
      return -1; // No annotations for justice view
    }
    return -1;
  }

  // Update the getModernAnnotationIndex function
  function getModernAnnotationIndex(step) {
    if (step >= 11 && step <= 13) {
      return -1; // No modern annotations in justice view
    }
    return -1;
  }

  // Intersection Observer setup
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
          setCurrentSequence(getAnnotationSequence(step));
        }
      });
    }, options);

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Additional logic
  useEffect(() => {
    if (currentStep >= 11 && currentStep <= 13) {
      console.log("Modern era step:", {
        step: currentStep,
        vizStep: getVisualizationStep(currentStep),
        sequence: getAnnotationSequence(currentStep),
        modernIndex: getModernAnnotationIndex(currentStep),
      });
    }
  }, [currentStep]);

  // Tooltip clearing logic
  const clearTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

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

  // Helper functions for section content
  function getSectionTitle(step) {
    const vizStep = getVisualizationStep(step);
    return SECTIONS[vizStep - 1]?.title || "";
  }

  function getSectionDescription(step) {
    const vizStep = getVisualizationStep(step);
    return SECTIONS[vizStep - 1]?.description || "";
  }

  return (
    <div className="supreme-court-timeline">
      <header className="pt-16 pb-12 space-y-4">
        <h1 className="text-4xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center">
          Shaping the Bench: Presidential Influence on the Supreme Court
        </h1>
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-600 text-center leading-relaxed">
          Explore how presidential appointments have shaped the Supreme Court
          over time, from broad political patterns to individual justices'
          impact. Scroll to uncover the evolving composition of the nation's
          highest court.
        </p>
      </header>

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
                step={getVisualizationStep(currentStep)}
                currentSequence={getAnnotationSequence(currentStep)}
                modernAnnotationIndex={getModernAnnotationIndex(currentStep)} // Add this prop
              />
            )}
          </div>
        </div>

        <div className="relative z-0">
          {Array(13)
            .fill(0)
            .map((_, index) => (
              <div
                key={index + 1}
                ref={(el) => (observerRefs.current[index] = el)}
                data-step={index + 1}
                className="min-h-screen flex items-center p-8"
              >
                <ScrollySection
                  title={getSectionTitle(index + 1)}
                  description={getSectionDescription(index + 1)}
                  step={index + 1}
                  currentStep={currentStep}
                  currentSequence={getAnnotationSequence(index + 1)}
                  modernAnnotationIndex={getModernAnnotationIndex(index + 1)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SupremeCourtTimeline;
