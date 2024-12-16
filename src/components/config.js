// config.js

// #region - Visual Styling Constants

export const DIMENSIONS = {
  width: 800,
  height: 400,
  margins: { top: 80, right: 100, bottom: 40, left: 40 },
};

export const COLORS = {
  party: {
    Republican: "#e34a33",
    Democrat: "#2b8cbe",
    Democratic: "#2b8cbe",
    "Democratic-Republican": "#2b8cbe",
    Federalist: "#a6a6a6",
    Whig: "#a6a6a6",
    Other: "#a6a6a6",
  },
};

// Style configuration for various elements
export const STYLE_CONFIG = {
  stream: {
    opacity: 0.85,
    stroke: {
      color: "white",
      opacity: 1,
      width: { default: 0.75, justice: 0.25 },
      join: "round",
      cap: "round",
    },
  },
  axis: { font: { size: "12px" } },
  "visualization-title": {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  "visualization-description": {
    fontSize: ".75rem",
    color: "#666",
    lineHeight: 1.6,
    maxWidth: "800px",
    margin: "0 auto 0",
    textAlign: "center",
  },
  // Add new consolidated era line styles
  eraLines: {
    standard: {
      stroke: "#666666",
      strokeWidth: 1,
      strokeDasharray: "6,4",
      opacity: 0.5,
    },
    highlighted: {
      stroke: "#000000",
      strokeWidth: 1.5,
      strokeDasharray: "6,4",
      opacity: 0.8,
    },
    background: {
      stroke: "#ffffff",
      strokeWidth: 10,
      opacity: 0.9,
    },
  },
  // Annotations styles
  annotations: {
    line: {
      standard: {
        stroke: "#cccccc",
        strokeWidth: 0.75,
        strokeDasharray: "3,3",
        opacity: 0.6,
      },
      highlighted: {
        stroke: "#666666",
        strokeWidth: 1,
        strokeDasharray: "none",
        opacity: 0.8,
      },
    },
    text: {
      container: {
        background: "rgba(255, 255, 255, 0.92)",
        padding: 8,
        borderRadius: 4,
      },
      label: {
        y: -30,
        fontSize: "13px",
        fontWeight: 600,
        fill: "#333333",
        letterSpacing: "0.02em",
      },
      description: {
        y: -15,
        fontSize: "11px",
        fontWeight: 400,
        fill: "#666666",
        maxWidth: 180,
      },
    },
  },

  eraLines: {
    standard: {
      stroke: "#cccccc",
      strokeWidth: 0.75,
      strokeDasharray: "4,4",
      opacity: 0.4,
    },
    highlighted: {
      stroke: "#666666",
      strokeWidth: 1,
      strokeDasharray: "4,4",
      opacity: 0.6,
    },
    background: {
      stroke: "#ffffff",
      strokeWidth: 8,
      opacity: 0.85,
    },
  },
  // Cursor styles
  cursor: {
    line: {
      stroke: "#666",
      strokeWidth: 1,
      strokeDasharray: "4,4",
    },
    label: {
      fontSize: "12px",
      fill: "#666",
      anchor: "middle",
    },
    interaction: {
      activeOpacity: 1,
      inactiveOpacity: 0.2,
      transitionDuration: "200ms",
    },
  },
  // Tooltips
  tooltip: {
    container: {
      background: "white",
      padding: {
        x: "0.75rem", // px-3
        y: "0.5rem", // py-2
      },
      border: "1px solid rgb(229, 231, 235)", // border-gray-200
      borderRadius: "0.375rem", // rounded
      maxWidth: "300px",
      transition: "all 50ms ease-out",
      zIndex: 9999,
    },
    text: {
      title: {
        fontWeight: "bold",
      },
      content: {
        marginTop: "0.25rem", // mt-1
      },
    },
  },
};

// #endregion

// #region - Content Configuration

// Content sections
export const TIMELINE_DATA = {
  // Party view (Step 1)
  court: {
    eras: [
      {
        id: "founding-era",
        name: "Founding Era",
        period: [1789, 1829],
        description: "Early Presidents establish core precedents",
        highlights: ["Washington", "Adams", "Jefferson"],
        annotations: [
          {
            year: 1801,
            label: "First Party Transition",
            description: "Federalists to Democratic-Republicans",
          },
        ],
      },
      {
        id: "civil-war",
        name: "Civil War & Reconstruction",
        period: [1860, 1877],
        description: "Court's role in national crisis",
        highlights: ["Lincoln", "Johnson", "Grant"],
        annotations: [
          {
            year: 1860,
            label: "Civil War Era",
            description: "Rise of Republican Party",
          },
        ],
      },
      {
        id: "new-deal",
        name: "New Deal Transformation",
        period: [1932, 1945],
        description: "FDR reshapes federal power",
        highlights: ["F. Roosevelt"],
        annotations: [
          {
            year: 1932,
            label: "New Deal Era",
            description: "Democratic dominance begins",
          },
        ],
      },
      {
        id: "civil-rights",
        name: "Civil Rights Era",
        period: [1953, 1969],
        description: "Warren Court expands individual rights",
        highlights: ["Eisenhower", "Kennedy", "Johnson"],
        annotations: [
          {
            year: 1954,
            label: "Warren Court",
            description: "Civil Rights Revolution begins",
          },
        ],
      },
      {
        id: "modern-era",
        name: "Modern Court Politics",
        period: [1969, 2024],
        description: "Growing polarization of nomination process",
        highlights: ["Nixon", "Reagan", "Trump"],
        annotations: [
          {
            year: 1968,
            label: "Conservative Shift",
            description: "Republican reshaping begins",
          },
        ],
      },
    ],
  },

  // Presidential view (Step 2)
  presidential: {
    legacies: [
      {
        id: "fdr-legacy",
        president: "F. Roosevelt",
        name: "Franklin D. Roosevelt",
        description:
          "Appointed 8 justices during the New Deal era, fundamentally reshaping constitutional interpretation",
        period: [1937, 1943],
        justiceIds: ["frankfurter", "douglas", "murphy", "jackson"],
        highlights: [
          {
            year: 1937,
            label: "Court-Packing Controversy",
            description:
              "Failed attempt to expand the Court led to ideological shift",
          },
          {
            year: 1941,
            label: "Liberal Majority Achieved",
            description:
              "FDR appointees form majority, enabling New Deal programs",
          },
        ],
      },
      {
        id: "washington-legacy",
        president: "Washington",
        name: "George Washington",
        description:
          "Established the first Supreme Court, appointing all six original justices",
        period: [1789, 1796],
        justiceIds: ["jay", "rutledge", "cushing"],
        highlights: [
          {
            year: 1789,
            label: "First Supreme Court",
            description: "Established with six justices",
          },
          {
            year: 1795,
            label: "Constitutional Foundations",
            description: "Set early precedents for federal judiciary",
          },
        ],
      },
      {
        id: "reagan-legacy",
        president: "Reagan",
        name: "Ronald Reagan",
        description:
          "Appointed first woman justice and shaped modern conservative jurisprudence",
        period: [1981, 1988],
        justiceIds: ["oconnor", "scalia", "kennedy"],
        highlights: [
          {
            year: 1981,
            label: "Historic Appointment",
            description: "Sandra Day O'Connor becomes first woman justice",
          },
          {
            year: 1986,
            label: "Conservative Shift",
            description:
              "Scalia appointment strengthens originalist interpretation",
          },
        ],
      },
    ],
  },

  // Individual Justices view (Step 3)
  justices: {
    annotations: [
      {
        year: 1954,
        label: "Warren Court",
        description: "Civil Rights Revolution",
      },
      {
        year: 1969,
        label: "Burger Court",
        description: "Conservative shift",
      },
      {
        year: 1986,
        label: "Rehnquist Court",
        description: "Federalism focus",
      },
      {
        year: 2005,
        label: "Roberts Court",
        description: "Current era begins",
      },
    ],
  },
};

// Main navigation sections
export const SECTIONS = [
  {
    id: 1,
    title: "Party Appointments Over Time",
    description: "View the cumulative appointments by political party",
  },
  {
    id: 2,
    title: "Presidential Legacy",
    description: "Key moments in Supreme Court appointments",
  },
  {
    id: 3,
    title: "Individual Justice Terms",
    description: "See the tenure of each Supreme Court Justice",
  },
];

// Helper functions to access data
export const getTimelineData = (step) => {
  return step === 1
    ? TIMELINE_DATA.court
    : step === 2
    ? TIMELINE_DATA.presidential
    : null;
};

export const getEraAnnotations = (step, eraIndex) => {
  const timeline = getTimelineData(step);
  return timeline?.eras[eraIndex]?.annotations || [];
};

// #endregion
