import { ResponsiveBar } from "@nivo/bar";

const VehiculeBarChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    type: item.abreviation,
    véhicules: item.nbre,
  }));

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={formattedData}
        keys={["véhicules"]}
        indexBy="type"
        margin={{ top: 40, right: 40, bottom: 80, left: 60 }} // plus d'espace en bas
        padding={0.3}
        layout="vertical"
        colors={{ scheme: "nivo" }}
        borderRadius={4}
        enableLabel={true}
        labelTextColor="#ffffff"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45, // rotation à 45°
          legend: "Type de véhicule",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Nombre",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        tooltip={({ id, value, indexValue }) => (
          <strong style={{ fontSize: 14 }}>
            {indexValue} : {value}
          </strong>
        )}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 11, // réduire taille police des ticks
              },
            },
            legend: {
              text: {
                fontSize: 13, // taille police des légendes
              },
            },
          },
          labels: {
            text: {
              fontSize: 12, // taille des labels sur les barres
            },
          },
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default VehiculeBarChart;