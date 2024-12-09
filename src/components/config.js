// config.js

// Dimensions for the visualization
export const DIMENSIONS = {
  width: 800,
  height: 400,
  margins: {
    top: 40,
    right: 100,
    bottom: 40,
    left: 40,
  },
};

// Color scheme for political parties
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
      width: {
        default: 0.75,
        justice: 0.25,
      },
      join: "round",
      cap: "round",
    },
  },
  axis: {
    font: {
      size: "12px",
    },
  },
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
};

// Court eras and their characteristics
export const COURT_TIMELINE = [
  {
    id: "founding-era",
    name: "Founding Era",
    period: [1789, 1829],
    description: "Early Presidents establish core precedents",
    highlights: ["Washington", "Adams", "Jefferson"],
    events: [
      {
        year: 1801,
        text: "First Transition of Power",
        description:
          "Jefferson's election marks first peaceful transfer between parties",
      },
      {
        year: 1803,
        text: "Marbury v. Madison",
        description: "Establishes judicial review",
      },
    ],
    step: 1,
  },
  {
    id: "civil-war",
    name: "Civil War & Reconstruction",
    period: [1860, 1877],
    description: "Court's role in national crisis",
    highlights: ["Lincoln", "Johnson", "Grant"],
    events: [
      {
        year: 1857,
        text: "Dred Scott Decision",
        description: "Intensifies sectional crisis",
      },
    ],
    step: 2,
  },
  {
    id: "new-deal",
    name: "New Deal Transformation",
    period: [1932, 1945],
    description: "FDR reshapes federal power",
    highlights: ["F. Roosevelt"],
    events: [
      {
        year: 1937,
        text: "Court-Packing Crisis",
        description: "FDR's failed attempt to expand court",
      },
    ],
    step: 3,
  },
  {
    id: "civil-rights",
    name: "Civil Rights Era",
    period: [1953, 1969],
    description: "Warren Court expands individual rights",
    highlights: ["Eisenhower", "Kennedy", "Johnson"],
    events: [
      {
        year: 1954,
        text: "Brown v. Board of Education",
        description: "Overturns racial segregation",
      },
    ],
    step: 4,
  },
  {
    id: "modern-era",
    name: "Modern Court Politics",
    period: [1969, 2024],
    description: "Growing polarization of nomination process",
    highlights: ["Nixon", "Reagan", "Trump"],
    events: [
      {
        year: 1987,
        text: "Bork Nomination",
        description: "Senate rejection transforms process",
      },
      {
        year: 2016,
        text: "Garland Nomination",
        description: "New precedent for election year",
      },
    ],
    step: 5,
  },
];

// Sections
export const SECTIONS = [
  {
    id: 1,
    title: "Party Appointments Over Time",
    description: "View the cumulative appointments by political party",
  },
  {
    id: 2,
    title: "Presidential Impact",
    description: "Explore how different presidents shaped the Court",
    steps: COURT_TIMELINE,
  },
  {
    id: 3,
    title: "Individual Justice Terms",
    description: "See the tenure of each Supreme Court Justice",
  },
];

// Define the step ID for the presidential view
export const PRESIDENTIAL_VIEW_STEP = 2;

// Annotations for different views
export const ANNOTATIONS = {
  1: [
    {
      year: 1801,
      label: "First Party Transition",
      description: "Federalists to Democratic-Republicans",
      era: 1,
    },
    {
      year: 1860,
      label: "Civil War Era",
      description: "Rise of Republican Party",
      era: 2,
    },
    {
      year: 1932,
      label: "New Deal Era",
      description: "Democratic dominance begins",
      era: 3,
    },
    {
      year: 1968,
      label: "Conservative Shift",
      description: "Republican reshaping begins",
      era: 4,
    },
  ],
  2: [
    {
      year: 1801,
      label: "Marshall Court",
      description: "Establishes judicial review",
    },
    {
      year: 1857,
      label: "Taney Court",
      description: "Dred Scott decision",
    },
    {
      year: 1937,
      label: "Court-Packing Crisis",
      description: "Constitutional revolution",
    },
    {
      year: 1987,
      label: "Modern Confirmation Battles",
      description: "Bork nomination",
    },
  ],
  3: [
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
};
