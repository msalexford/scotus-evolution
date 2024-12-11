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
        strokeWidth: 1,
        strokeDasharray: "5,5",
      },
      highlighted: {
        stroke: "#ff0000",
        strokeWidth: 2,
        strokeDasharray: "none",
      },
    },
    text: {
      label: {
        y: -40,
        fontSize: "14px",
        fontWeight: 600,
        fill: "#333",
      },
      description: {
        y: -25,
        fontSize: "12px",
        fontWeight: 400,
        fill: "#666",
      },
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
    eras: [
      {
        id: "founding-impact",
        name: "Early Presidential Impact",
        period: [1789, 1809],
        description: "Washington and Adams establish the federal judiciary",
        highlights: ["George Washington", "John Adams"],
        annotations: [
          {
            year: 1789,
            label: "Washington's Court",
            description: "Establishes first Supreme Court with 6 justices",
          },
          {
            year: 1796,
            label: "First Court Expansion",
            description: "Congress adds 7th justice to serve new circuits",
          },
          {
            year: 1801,
            label: "Marshall Court Begins",
            description: "Adams appoints influential Chief Justice Marshall",
          },
        ],
      },
      {
        id: "antebellum-courts",
        name: "Antebellum Courts",
        period: [1810, 1860],
        description: "Expanding federal power through judicial appointments",
        highlights: ["Thomas Jefferson", "Andrew Jackson"],
        annotations: [
          {
            year: 1807,
            label: "Jefferson's Influence",
            description: "Appoints majority of Court during presidency",
          },
          {
            year: 1837,
            label: "Jackson's Reshaping",
            description: "Appointed 6 justices, including Chief Justice Taney",
          },
        ],
      },
      {
        id: "civil-war-reconstruction",
        name: "Civil War & Reconstruction",
        period: [1861, 1877],
        description: "Reshaping the judiciary for a new constitutional order",
        highlights: ["Abraham Lincoln", "Ulysses S. Grant"],
        annotations: [
          {
            year: 1863,
            label: "Lincoln's Appointments",
            description: "Reshapes Court during Civil War with 5 justices",
          },
          {
            year: 1869,
            label: "Grant's Impact",
            description: "Expands Court to 9 justices, still current size",
          },
        ],
      },
      {
        id: "progressive-era",
        name: "Progressive Era Changes",
        period: [1901, 1932],
        description: "New responses to industrialization",
        highlights: ["Theodore Roosevelt", "William Howard Taft"],
        annotations: [
          {
            year: 1902,
            label: "TR's Influence",
            description: "Theodore Roosevelt appoints 3 justices",
          },
          {
            year: 1921,
            label: "Taft to Chief Justice",
            description: "Former President becomes Chief Justice",
          },
        ],
      },
      {
        id: "new-deal-courts",
        name: "New Deal Transformation",
        period: [1933, 1945],
        description: "FDR's impact on constitutional interpretation",
        highlights: ["Franklin D. Roosevelt"],
        annotations: [
          {
            year: 1937,
            label: "Court-Packing Fight",
            description: "FDR's failed attempt to expand the Court",
          },
          {
            year: 1941,
            label: "FDR's Transformation",
            description: "New Deal supporter majority achieved",
          },
        ],
      },
      {
        id: "modern-politics",
        name: "Modern Court Politics",
        period: [1969, 2024],
        description: "Ideological battles over the Court's direction",
        highlights: ["Richard Nixon", "Ronald Reagan", "Donald Trump"],
        annotations: [
          {
            year: 1969,
            label: "Nixon's Influence",
            description: "Begins conservative shift with 4 appointments",
          },
          {
            year: 1981,
            label: "Reagan's Impact",
            description: "Appoints O'Connor as first woman justice",
          },
          {
            year: 2017,
            label: "Modern Appointments",
            description: "Three appointments reshape conservative majority",
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
