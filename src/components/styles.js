// styles.js

export const THEME = {
  colors: {
    party: {
      Republican: "#e34a33",
      Democrat: "#2b8cbe",
      "Democratic-Republican": "#2b8cbe",
      Federalist: "#a6a6a6",
      Whig: "#a6a6a6",
      Other: "#a6a6a6",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
      muted: "#999999",
    },
    backgrounds: {
      white: "#ffffff",
      overlay: "rgba(255, 255, 255, 0.9)",
    },
    borders: {
      light: "#e5e7eb",
    },
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },

  typography: {
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      base: 1.5,
      relaxed: 1.75,
    },
  },

  layout: {
    dimensions: {
      width: 800,
      height: 400,
      margins: {
        top: 80,
        right: 100,
        bottom: 40,
        left: 40,
      },
    },
    maxWidth: {
      content: "42rem", // ~672px
    },
  },

  visualization: {
    stream: {
      opacity: 0.85,
      stroke: {
        color: "#ffffff",
        width: {
          default: 0.75,
          justice: 0.25,
        },
        opacity: 1,
      },
    },
    annotations: {
      line: {
        standard: {
          stroke: "#cccccc",
          width: 1,
          dashArray: "5,5",
        },
        highlight: {
          stroke: "#000000",
          width: 1.5,
          dashArray: "none",
          opacity: 0.8,
        },
      },
      text: {
        label: {
          offset: -40,
          fontSize: "14px",
          fontWeight: 600,
          color: "#333333",
        },
        description: {
          offset: -25,
          fontSize: "12px",
          fontWeight: 400,
          color: "#666666",
        },
      },
    },
    tooltip: {
      container: {
        background: "#ffffff",
        padding: {
          x: "0.75rem",
          y: "0.5rem",
        },
        border: "1px solid #e5e7eb",
        borderRadius: "0.375rem",
        maxWidth: "300px",
        transition: "all 50ms ease-out",
        zIndex: 9999,
      },
      text: {
        title: {
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#333333",
        },
        content: {
          fontSize: "0.875rem",
          color: "#666666",
          marginTop: "0.25rem",
        },
      },
    },
  },

  components: {
    legend: {
      container: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "10px",
      },
      item: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      colorBox: {
        width: "20px",
        height: "20px",
        borderRadius: "4px",
      },
    },
    scrollySection: {
      container: {
        minHeight: "100vh",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
      content: {
        maxWidth: "42rem",
      },
      title: {
        fontSize: "1.5rem",
        fontWeight: 700,
        marginBottom: "0.5rem",
        color: "#333333",
      },
      description: {
        color: "#666666",
        fontSize: "1rem",
        lineHeight: 1.5,
      },
    },
    viewTitle: {
      container: {
        position: "absolute",
        top: "-48px",
        pointerEvents: "none",
      },
      text: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#666666",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  },
};

// Helper functions for common style patterns
export const createTransition = (properties = ["all"], duration = 200) => ({
  transition: properties
    .map((prop) => `${prop} ${duration}ms ease-out`)
    .join(", "),
});

export const createElevation = (level = 1) => {
  const elevations = {
    1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    2: "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
    3: "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
  };
  return { boxShadow: elevations[level] || elevations[1] };
};

// Export utility class for consistent style application
export const styles = {
  // Combine typography styles
  text: (size = "base", weight = "normal", color = "primary") => ({
    fontSize: THEME.typography.fontSizes[size],
    fontWeight: THEME.typography.fontWeights[weight],
    color: THEME.colors.text[color],
  }),

  // Flexbox utilities
  flex: {
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
  },

  // Spacing utilities
  spacing: (space) => ({
    margin: THEME.spacing[space],
    padding: THEME.spacing[space],
  }),
};

export const scrollySectionStyles = {
  section: "min-h-screen p-5 flex flex-col justify-center",
  content: "max-w-2xl",
  title: "text-2xl font-bold mb-2",
  description: "text-gray-700",
  progressiveSteps: "mt-4 space-y-4",
  step: "p-4 rounded-lg bg-gray-50",
  active: "bg-blue-50 border-l-4 border-blue-500",
};
