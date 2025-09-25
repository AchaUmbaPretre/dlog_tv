import React, { memo } from "react";
import { Badge } from "antd";

const VehicleSpeed = ({ speed = 0, engineOn = false, maxSpeed = 180 }) => {
  // Couleur selon la vitesse
  let color = "green";
  if (speed >= 30 && speed <= 60) color = "orange";
  else if (speed > 60) color = "red";

  const isCritical = speed > 120;

  // Paramètres du tachymètre
  const radius = 90;
  const center = 100;
  const startAngle = -120; // départ de l'arc
  const endAngle = 120; // fin de l'arc

  const toRad = (deg) => (deg * Math.PI) / 180;

  // Calcul angle de l'arc selon la vitesse
  const angle = startAngle + (Math.min(speed, maxSpeed) / maxSpeed) * (endAngle - startAngle);

  // Coordonnées de fin de l'arc
  const arcX = center + radius * Math.cos(toRad(angle));
  const arcY = center + radius * Math.sin(toRad(angle));

  const largeArcFlag = angle - startAngle > 180 ? 1 : 0;

  // Path de l'arc dynamique
  const path = `
    M ${center + radius * Math.cos(toRad(startAngle))} ${center + radius * Math.sin(toRad(startAngle))}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${arcX} ${arcY}
  `;

  // Générer les graduations
  const ticks = [];
  const numTicks = 9; // tous les 20 km/h
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = startAngle + (i / numTicks) * (endAngle - startAngle);
    const innerRadius = radius - 10;
    const outerRadius = radius;
    const x1 = center + innerRadius * Math.cos(toRad(tickAngle));
    const y1 = center + innerRadius * Math.sin(toRad(tickAngle));
    const x2 = center + outerRadius * Math.cos(toRad(tickAngle));
    const y2 = center + outerRadius * Math.sin(toRad(tickAngle));

    // Texte graduations
    const textRadius = radius - 25;
    const tx = center + textRadius * Math.cos(toRad(tickAngle));
    const ty = center + textRadius * Math.sin(toRad(tickAngle));

    ticks.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
        <text
          x={tx}
          y={ty + 5}
          textAnchor="middle"
          fontSize="12"
          fill="black"
        >
          {i * (maxSpeed / numTicks)}
        </text>
      </g>
    );
  }

  // Coordonnées de l'aiguille
  const needleLength = radius - 15;
  const needleX = center + needleLength * Math.cos(toRad(angle));
  const needleY = center + needleLength * Math.sin(toRad(angle));

  return (
    <div style={{ maxWidth: 200, margin: "0 auto", textAlign: "center" }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* Cercle de fond */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          stroke="#eee"
          strokeWidth="15"
        />

        {/* Arc dynamique */}
        <path
          d={path}
          fill="none"
          stroke={color}
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
          stroke={isCritical ? "red" : "black"}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Centre de l'aiguille */}
        <circle cx={center} cy={center} r="5" fill="black" />

        {/* Vitesse */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="60"
          fontWeight="bold"
          fill={color}
          style={{ animation: isCritical ? "blink 1s infinite" : "none" }}
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