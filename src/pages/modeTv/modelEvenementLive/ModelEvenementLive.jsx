import { useEffect, useState } from "react";
import { Timeline, Card, Typography } from "antd";
import { CarOutlined, ClockCircleOutlined, FlagOutlined } from "@ant-design/icons";
import "./modelEvenementLive.scss";
import moment from "moment";

const { Text } = Typography;

const ModelEvenementLive = ({ evenementLiveRow }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!evenementLiveRow) return;

    const formattedEvents = evenementLiveRow.map((item) => ({
      id: item.id_bande_sortie,
      time: moment(item.sortie_time).format("DD-MM-YYYY HH:mm"),
      status: item.nom_statut_bs,
      immatriculation: item.immatriculation,
      destination: item.nom_destination,
    }));

    setEvents(formattedEvents);
  }, [evenementLiveRow]);

  const getIcon = (status) => {
    switch (status) {
      case "Départ":
        return <CarOutlined style={{ color: "#1890ff", fontSize: 24 }} />;
      case "En route":
        return <ClockCircleOutlined style={{ color: "#faad14", fontSize: 24 }} />;
      case "Arrivé":
        return <FlagOutlined style={{ color: "#52c41a", fontSize: 24 }} />;
      default:
        return <ClockCircleOutlined style={{ fontSize: 24 }} />;
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case "Départ":
        return "#1890ff"; // bleu
      case "En route":
        return "#faad14"; // orange
      case "Arrivé":
        return "#52c41a"; // vert
      default:
        return "#fff"; // blanc par défaut
    }
  };

  return (
    <div className="modelEvenementLive">
      <Card 
        title={<span style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>🚦 Fil d'évènements live</span>}
      bordered={false} 
      className="event-card"
    >
        <Timeline mode="left">
          {events.map((event) => (
            <Timeline.Item key={event.id} dot={getIcon(event.status)}>
              <div className="event-item">
                <Text strong style={{ fontSize: 22, color: "#fff" }}>
                  {event.time}
                </Text>{" "}
                <Text strong style={{ fontSize: 22, color: getTextColor(event.status) }}>
                  {event.status}
                </Text>
                <br />
                <Text strong style={{ fontSize: 20, color: "#fff" }}>
                  🚘 {event.immatriculation} → 📍 {event.destination}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default ModelEvenementLive;
