import { ResponsivePie } from '@nivo/pie';

const ServicePieChart = ({ data }) => {
  const formattedData = data.map((item, index) => ({
    id: item.nom_service,
    label: item.nom_service,
    value: item.nbre,
  }));

  return (
    <div style={{ height: 300 }}>
      <ResponsivePie
        data={formattedData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={5}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'paired' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#555"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#fff"
        tooltip={({ datum }) => (
          <strong style={{ fontSize: 14 }}>
            {datum.label}: {datum.value}
          </strong>
        )}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default ServicePieChart;
