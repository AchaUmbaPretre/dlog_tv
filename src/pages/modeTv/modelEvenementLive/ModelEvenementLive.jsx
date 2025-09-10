import { useEffect, useState } from "react";
import { Timeline, Card, Typography, Tag } from "antd";
import { CarOutlined, ClockCircleOutlined, FlagOutlined } from "@ant-design/icons";
import "./modelEvenementLive.scss";
import moment from "moment";

const { Text } = Typography;

const ModelEvenementLive = ({ evenementLiveRow }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!evenementLiveRow) return;

    // Transformation de la donnée reçue pour le Timeline
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
        return <CarOutlined style={{ color: "#1890ff" }} />;
      case "En route":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Arrivé":
        return <FlagOutlined style={{ color: "#52c41a" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getTagColor = (status) => {
    switch (status) {
      case "Départ":
        return "blue";
      case "En route":
        return "orange";
      case "Arrivé":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div className="modelEvenementLive">
      <Card title="🚦 Fil d'évènements live" bordered={false} className="event-card">
        <Timeline mode="left">
          {events.map((event) => (
            <Timeline.Item key={event.id} dot={getIcon(event.status)}>
              <div className="event-item">
                <Text strong>{event.time}</Text>{" "}
                <Tag color={getTagColor(event.status)}>{event.status}</Tag>
                <br />
                <Text type="secondary">
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
