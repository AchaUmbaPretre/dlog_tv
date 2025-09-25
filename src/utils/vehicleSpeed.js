import React, { memo } from "react";
import { Badge } from "antd";

const VehicleSpeed = ({ speed = 0, engineOn = false }) => {
  const isCritical = speed > 120;

  return (
    <div style={{ maxWidth: 150, margin: "0 auto", textAlign: "center" }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* Cercle extérieur rouge */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="white"
          stroke="red"
          strokeWidth="15"
        />

        {/* Vitesse */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="60"
          fontWeight="bold"
          fill="black"
          style={{
            animation: isCritical ? "blink 1s infinite" : "none",
          }}
        >
          {speed}
        </text>

        {/* KM/H */}
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="black"
        >
          KM/H
        </text>

        <style>{`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `}</style>
      </svg>

      {/* Badge moteur */}
      <Badge
        status={engineOn ? "success" : "error"}
        text={engineOn ? "ON" : "OFF"}
        style={{ fontSize: 18, color: engineOn ? "green" : "red", marginTop: 8 }}
      />
    </div>
  );
};

export default memo(VehicleSpeed);
