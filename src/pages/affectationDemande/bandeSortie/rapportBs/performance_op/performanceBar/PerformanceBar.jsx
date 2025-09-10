import { useEffect, useState } from "react";
import { Card, Tooltip, Switch } from "antd";
import { ResponsiveBar } from "@nivo/bar";

const PerformanceBar = ({ graphData }) => {
  const [tickRotation, setTickRotation] = useState(0);
  const [tickFontSize, setTickFontSize] = useState(13);
  const [forceRotation, setForceRotation] = useState(false);
  const [marginBottom, setMarginBottom] = useState(70);

  // Ajustement dynamique
  useEffect(() => {
    const adjustSettings = () => {
      const maxLabelLength = Math.max(...graphData.map(d => d.destination.length), 0);
      if (graphData.length > 6 || maxLabelLength > 12 || window.innerWidth < 900) {
        setTickRotation(-45);
        setTickFontSize(11);
        setMarginBottom(Math.max(90, maxLabelLength * 5));
      } else {
        setTickRotation(0);
        setTickFontSize(13);
        setMarginBottom(70);
      }
    };
    adjustSettings();
    window.addEventListener("resize", adjustSettings);
    return () => window.removeEventListener("resize", adjustSettings);
  }, [graphData]);

    const finalRotation = forceRotation ? -45 : tickRotation;
    const finalMarginBottom = forceRotation ? Math.max(90, marginBottom) : marginBottom;

    const colors = (bar) =>
    bar.value >= 5 ? "#28a745" : bar.value >= 2 ? "#fd7e14" : "#dc3545";


  return (
    <Card
      type="inner"
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Durée moyenne par destination</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>Forcer rotation 45°</span>
            <Switch size="small" checked={forceRotation} onChange={setForceRotation} />
          </div>
        </div>
      }
      style={{ marginBottom: 16 }}
    >
      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={graphData}
          keys={["duree"]}
          indexBy="destination"
          margin={{ top: 20, right: 50, bottom: finalMarginBottom, left: 70 }}
          padding={0.3}
          colors={colors}
            animate={true}          // animation intégrée de Nivo
            motionConfig="gentle"  
          axisBottom={{
            tickRotation: finalRotation,
            legend: "Destination",
            legendPosition: "middle",
            legendOffset: 70,
          }}
          axisLeft={{
            legend: "Durée moyenne (h)",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          enableLabel
          labelSkipWidth={20}
          labelSkipHeight={14}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
          tooltip={({ indexValue, value }) => (
            <Tooltip title={`${indexValue}: ${value} h`}>
              <span>{value} h</span>
            </Tooltip>
          )}
          theme={{
            axis: {
              ticks: { text: { fontSize: tickFontSize } },
              legend: { text: { fontSize: 13, fontWeight: 600 } },
            },
            labels: { text: { fontSize: 11, fontWeight: 500 } },
          }}
          animate
        />
      </div>
    </Card>
  );
};

export default PerformanceBar;
