import React, { memo } from "react";
import { Badge } from "antd";

const VehicleSpeed = ({ speed = 0, engineOn = false }) => {
  // Couleur selon vitesse
  const color = speed > 120 ? "red" : speed > 5 ? "green" : speed > 0 ? "orange" : "red";
  const isCritical = speed > 120;
  const fontSize = Math.min(Math.max(20, speed / 2), 36);
  const radius = 55 + Math.min(speed / 5, 10);
  const strokeWidth = 10 + Math.min(speed / 20, 5);

  return (
    <div style={{ maxWidth: 90, margin: "0 auto", textAlign: "center" }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="white"
          stroke={color}
          strokeWidth={strokeWidth}
          style={{ transition: "all 0.3s ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={fontSize}
          fontWeight="bold"
          fill={color}
          style={{
            animation: isCritical ? "blink 1s infinite" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {speed}
        </text>
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          fontSize="12"
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
      <Badge
        status={engineOn ? "success" : "error"}
        text={engineOn ? "ON" : "OFF"}
        style={{ fontSize: 16, color: engineOn ? "green" : "red" }}
      />
    </div>
  );
};

export default memo(VehicleSpeed);
