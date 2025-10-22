import React, { memo, useEffect, useState } from "react";
import { Badge } from "antd";

const VehicleSpeed = ({ speed = 0, engineOn = false, maxSpeed = 180 }) => {
  const [displaySpeed, setDisplaySpeed] = useState(speed);
  const [reflectOffset, setReflectOffset] = useState(-1); // pour animation du reflet

  // Animation fluide de la vitesse
  useEffect(() => {
    const diff = speed - displaySpeed;
    if (Math.abs(diff) < 1) {
      setDisplaySpeed(speed);
      return;
    }
    const step = diff / 5; 
    const id = setTimeout(() => setDisplaySpeed((prev) => prev + step), 30);
    return () => clearTimeout(id);
  }, [speed, displaySpeed]);

  // Animation du reflet
  useEffect(() => {
    const id = setInterval(() => {
      setReflectOffset((prev) => (prev > 1 ? -1 : prev + 0.02));
    }, 30);
    return () => clearInterval(id);
  }, []);

  const center = 100;
  const radius = 90;
  const startAngle = -120;
  const endAngle = 120;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const angle = startAngle + (Math.min(displaySpeed, maxSpeed) / maxSpeed) * (endAngle - startAngle);

  const needleLength = radius - 15;
  const needleX = center + needleLength * Math.cos(toRad(angle));
  const needleY = center + needleLength * Math.sin(toRad(angle));

  // Graduations
  const ticks = [];
  const tickStep = 10;
  const numTicks = maxSpeed / tickStep;
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = startAngle + (i / numTicks) * (endAngle - startAngle);
    const innerRadius = radius - (i % 2 === 0 ? 15 : 10);
    const outerRadius = radius;
    const x1 = center + innerRadius * Math.cos(toRad(tickAngle));
    const y1 = center + innerRadius * Math.sin(toRad(tickAngle));
    const x2 = center + outerRadius * Math.cos(toRad(tickAngle));
    const y2 = center + outerRadius * Math.sin(toRad(tickAngle));

    const textRadius = radius - 30;
    const tx = center + textRadius * Math.cos(toRad(tickAngle));
    const ty = center + textRadius * Math.sin(toRad(tickAngle));

    ticks.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
        {i % 2 === 0 && (
          <text x={tx} y={ty + 4} textAnchor="middle" fontSize="10" fill="black">
            {i * tickStep}
          </text>
        )}
      </g>
    );
  }

  return (
    <div style={{ maxWidth: 110, margin: "0 auto", textAlign: "center" }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="radialBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#ccc" />
          </radialGradient>

          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="green" />
            <stop offset="50%" stopColor="orange" />
            <stop offset="100%" stopColor="red" />
          </linearGradient>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
          </filter>

          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cercle de fond */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#radialBg)"
          stroke="#999"
          strokeWidth="3"
          filter="url(#shadow)"
        />

        {/* Arc dynamique */}
        <path
          d={`
            M ${center + radius * Math.cos(toRad(startAngle))} ${center + radius * Math.sin(toRad(startAngle))}
            A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos(toRad(endAngle))} ${center + radius * Math.sin(toRad(endAngle))}
          `}
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Graduations */}
        {ticks}

        {/* Aiguille */}
        <line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke={displaySpeed > 120 ? "red" : "black"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={center} cy={center} r="5" fill="black" />

        {/* Reflet animé */}
        <ellipse
          cx={center + reflectOffset * radius * 0.8} // déplacement horizontal
          cy={center - 25}
          rx={radius / 2}
          ry={radius / 4}
          fill="url(#glassGradient)"
        />

        {/* Vitesse */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="60"
          fontWeight="bold"
          fill={displaySpeed > 60 ? "red" : displaySpeed >= 30 ? "orange" : "green"}
          style={{ animation: displaySpeed > 120 ? "blink 1s infinite" : "none" }}
        >
          {Math.round(displaySpeed)}
        </text>

        {/* KM/H */}
        <text x="50%" y="75%" textAnchor="middle" fontSize="22" fontWeight="bold" fill="black">
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
