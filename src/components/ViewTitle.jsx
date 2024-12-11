import React from "react";

const ViewTitle = ({ step, margins }) => {
  const titles = {
    1: "Political Party Influence",
    2: "Presidential Legacy",
    3: "Individual Justice Tenures",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "-48px",
        left: `${margins?.left || 0}px`,
        pointerEvents: "none",
      }}
    >
      <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
        {titles[step]}
      </h2>
    </div>
  );
};

export default ViewTitle;
