// ScrollySection.jsx

// #region - Imports

import React from "react";
import PropTypes from "prop-types";
import { scrollySectionStyles as styles } from "./styles";
import { TIMELINE_DATA } from "./config";
import { SECTIONS } from "./config";

// #endregion

const PRESIDENTIAL_STEPS = [
  {
    id: "appointments",
    title: "Presidential Appointments",
    description: "See how many justices each president appointed",
    highlightYears: [1869, 1937],
  },
  {
    id: "tenure-impact",
    title: "Length of Influence",
    description: "Track how long each president's appointees served", // Fixed apostrophe
    highlightYears: [1801, 1969],
  },
  {
    id: "court-control",
    title: "Court Control",
    description: "Observe how presidents shaped Court majorities",
    highlightYears: [1937, 1987],
  },
];

const JUSTICE_STEPS = [
  {
    id: "tenure-patterns",
    title: "Tenure Patterns",
    description: "Compare how long different justices served",
    highlightYears: [1803, 1954],
  },
  {
    id: "retirement-timing",
    title: "Retirement Timing",
    description: "See when and why justices chose to retire",
    highlightYears: [1937, 1986],
  },
  {
    id: "court-dynamics",
    title: "Court Dynamics",
    description: "Examine how retirements shaped Court balance",
    highlightYears: [1986, 2005],
  },
];

const ScrollySection = ({ step, currentSequence }) => {
  const section = SECTIONS.find((s) => s.id === step);
  const steps =
    step === 2 ? PRESIDENTIAL_STEPS : step === 3 ? JUSTICE_STEPS : null;

  if (!section) return null;

  return (
    <div className={styles.section}>
      <h2>{section.title}</h2>
      <p>{section.description}</p>
      {steps && (
        <div className={styles.progressiveSteps}>
          {steps.map((progressiveStep, index) => (
            <div
              key={progressiveStep.id}
              className={`${styles.step} ${
                index === currentSequence ? styles.active : ""
              }`}
            >
              <h3>{progressiveStep.title}</h3>
              <p>{progressiveStep.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ScrollySection.propTypes = {
  step: PropTypes.number.isRequired,
  currentSequence: PropTypes.number.isRequired,
};

export default ScrollySection;
