// DataProcessing.js

// #region - Imports

import * as d3 from "d3";
import { COLORS, STYLE_CONFIG } from "./config";

// #endregion

//#region - Helper Functions

/**
 * Get the color for a given political party
 * @param {string} party - The political party
 * @returns {string} The color associated with the party
 */

const getPartyColor = (party) => {
  return COLORS.party[party] || COLORS.party.Other;
};

/**
 * Get the current year or the end year of a justice's term
 * @param {Object} justice - The justice object
 * @returns {number} The current year or the end year of the justice's term
 */
const getCurrentYear = (justice) => {
  const currentYear = new Date().getFullYear();
  if (
    justice.reason_for_departure === "Currently serving" ||
    !justice.end_date
  ) {
    return currentYear;
  }
  try {
    const endYear = new Date(justice.end_date).getFullYear();
    return isNaN(endYear) ? currentYear : Math.min(endYear, currentYear);
  } catch (e) {
    console.warn(`Invalid end_date for justice: ${justice.name}`);
    return currentYear;
  }
};

/**
 * Get the court size for a given year
 * @param {Object} data - The data object containing size changes
 * @param {number} year - The year to check
 * @returns {number} The court size for the given year
 */
const getCourtSize = (data, year) => {
  const sizeChanges = data.sizes
    .map((change) => ({
      year: new Date(change.date).getFullYear(),
      size: parseInt(change.new_size),
    }))
    .sort((a, b) => a.year - b.year);
  const applicableSize = sizeChanges
    .filter((change) => change.year <= year)
    .pop();
  return applicableSize ? applicableSize.size : 9;
};

/**
 * Validate a justice's data
 * @param {Object} justice - The justice object
 * @returns {Object} An object containing validation results
 */
const validateJustice = (justice) => {
  const startYear = new Date(justice.nomination_date).getFullYear();
  const endYear = getCurrentYear(justice);
  if (isNaN(startYear)) {
    console.warn(`Invalid nomination_date for justice: ${justice.name}`);
    return { isValid: false };
  }
  return {
    startYear,
    endYear,
    isValid:
      startYear <= endYear &&
      startYear >= 1789 &&
      endYear <= getCurrentYear({}),
  };
};

/**
 * Get the party affiliation of a justice
 */
const getPartyAffiliation = (justice, data) => {
  const president = data.presidents.find(
    (p) => p.president === justice.president_id
  );
  const party = president?.["president-party"];
  if (party === "Republican") return "republican";
  if (["Democrat", "Democratic", "Democratic-Republican"].includes(party))
    return "democrat";
  return "other";
};

/**
 * Configure the D3 stack layout
 * @param {Object} d3 - The D3 library object
 * @returns {Object} The configured D3 stack layout
 */
const configureStack = (d3) => {
  return d3
    .stack()
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderAppearance);
};

/**
 * Process the base data for all visualizations
 * @param {Object} data - The raw data object
 * @returns {Object} An object containing processed timeline data and successful justices
 */
const processBaseData = (data) => {
  const years = d3.range(1789, getCurrentYear({}) + 1);
  const timelineData = years.map((year) => ({
    year,
    total: getCourtSize(data, year),
  }));
  const successfulJustices = data.justices
    .filter((justice) => justice.status === "Successful")
    .map((justice) => {
      const { startYear, endYear, isValid } = validateJustice(justice);
      const president = data.presidents.find(
        (p) => p.president === justice.president_id
      );
      if (!isValid) return null;
      return {
        ...justice,
        startYear,
        endYear,
        party: getPartyAffiliation(justice, data),
        president: president?.president,
      };
    })
    .filter(Boolean);
  return { timelineData, successfulJustices };
};

// #endregion

//#region - Main Processing Functions

/**
 * Process data for party-based visualization
 * @param {Object} data - The raw data object
 * @param {Object} d3 - The D3 library object
 * @returns {Object} Processed data for party-based visualization
 */
export const processPartyData = (data, d3) => {
  const { timelineData, successfulJustices } = processBaseData(data);

  timelineData.forEach((yearData) => {
    yearData.republican = 0;
    yearData.democrat = 0;
    yearData.other = 0;

    const activeJustices = successfulJustices.filter(
      (justice) =>
        yearData.year >= justice.startYear && yearData.year <= justice.endYear
    );

    activeJustices.forEach((justice) => {
      yearData[justice.party.toLowerCase()] += 1;
    });

    // Normalize values to percentages
    const total = yearData.republican + yearData.democrat + yearData.other;
    yearData.republican = (yearData.republican / total) * 100;
    yearData.democrat = (yearData.democrat / total) * 100;
    yearData.other = (yearData.other / total) * 100;
  });

  const stack = d3
    .stack()
    .keys(["other", "democrat", "republican"])
    .offset(d3.stackOffsetExpand); // Ensures stacking is normalized to 100%

  return {
    series: stack(timelineData),
    colors: {
      republican: COLORS.party.Republican,
      democrat: COLORS.party.Democrat,
      other: COLORS.party.Other,
    },
    style: STYLE_CONFIG,
    legendItems: [
      { key: "republican", label: "Republican Appointees" },
      { key: "democrat", label: "Democratic Appointees" },
      { key: "other", label: "Other Party Appointees" },
    ],
  };
};

/**
 * Process data for president-based visualization
 * @param {Object} data - The raw data object
 * @param {Object} d3 - The D3 library object
 * @returns {Object} Processed data for president-based visualization
 */
export const processPresidentData = (data, d3) => {
  const { timelineData, successfulJustices } = processBaseData(data);
  timelineData.forEach((yearData) => {
    const courtSize = yearData.total;

    const total = yearData.republican + yearData.democrat + yearData.other;
    yearData.republican = (yearData.republican / total) * courtSize;
    yearData.democrat = (yearData.democrat / total) * courtSize;
    yearData.other = (yearData.other / total) * courtSize;

    data.presidents.forEach((president) => {
      yearData[president.president] = 0;
    });

    const activeJustices = successfulJustices.filter(
      (justice) =>
        yearData.year >= justice.startYear && yearData.year <= justice.endYear
    );
    activeJustices.forEach((justice) => {
      yearData[justice.president_id]++;
    });
  });

  const presidentColors = Object.fromEntries(
    data.presidents.map((p) => [
      p.president,
      getPartyColor(p["president-party"]),
    ])
  );

  const stack = configureStack(d3).keys(
    data.presidents.map((p) => p.president)
  );

  return {
    series: stack(timelineData),
    colors: presidentColors,
    style: STYLE_CONFIG,
    legendItems: data.presidents.map((president) => ({
      key: president.president,
      label: president["president-full-name"],
      color: presidentColors[president.president],
      startYear: new Date(president["presidency-start"]).getFullYear(),
      endYear: new Date(president["presidency-end"]).getFullYear(),
    })),
  };
};

/**
 * Process data for justice-based visualization
 * @param {Object} data - The raw data object
 * @param {Object} d3 - The D3 library object
 * @returns {Object} Processed data for justice-based visualization
 */
export const processJusticeData = (data, d3) => {
  const { timelineData, successfulJustices } = processBaseData(data);

  timelineData.forEach((yearData) => {
    const courtSize = yearData.total;

    const total = yearData.republican + yearData.democrat + yearData.other;
    yearData.republican = (yearData.republican / total) * courtSize;
    yearData.democrat = (yearData.democrat / total) * courtSize;
    yearData.other = (yearData.other / total) * courtSize;

    successfulJustices.forEach((justice) => {
      yearData[justice.name] = 0;
    });

    const activeJustices = successfulJustices.filter(
      (justice) =>
        yearData.year >= justice.startYear && yearData.year <= justice.endYear
    );
    activeJustices.forEach((justice) => {
      yearData[justice.name] = 1;
    });
  });

  const justiceColors = Object.fromEntries(
    successfulJustices.map((justice) => [
      justice.name,
      COLORS.party[
        justice.party === "republican"
          ? "Republican"
          : justice.party === "democrat"
          ? "Democrat"
          : "Other"
      ],
    ])
  );

  const stack = configureStack(d3).keys(successfulJustices.map((j) => j.name));

  return {
    series: stack(timelineData),
    colors: justiceColors,
    style: STYLE_CONFIG,
    legendItems: successfulJustices.map((justice) => ({
      key: justice.name,
      label: justice["name-full"],
      color: justiceColors[justice.name],
      group: justice.president_id,
      startYear: new Date(justice.confirmation_date).getFullYear(),
      endYear: justice.end_date
        ? new Date(justice.end_date).getFullYear()
        : null,
    })),
  };
};

// #endregion
