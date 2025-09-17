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
        return <CarOutlined style={{ color: "#1890ff", fontSize: 26 }} />;
      case "En route":
        return <ClockCircleOutlined style={{ color: "#faad14", fontSize: 26 }} />;
      case "Arrivé":
        return <FlagOutlined style={{ color: "#52c41a", fontSize: 26 }} />;
      default:
        return <ClockCircleOutlined style={{ fontSize: 26, color: "#999" }} />;
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case "Départ":
        return "#1890ff"; 
      case "En route":
        return "#faad14"; 
      case "Arrivé":
        return "#52c41a"; 
      default:
        return "#ccc"; 
    }
  };

  return (
    <div className="modelEvenementLive">
      <Card
        title={<span className="event-title">🚦 Fil d'évènements live</span>}
        bordered={false}
        className="event-card"
      >
        <Timeline mode="left">
          {events.map((event) => (
            <Timeline.Item key={event.id} dot={getIcon(event.status)}>
              <div className="event-item">
                <Text strong className="event-time">{event.time}</Text>
                <Text strong style={{ color: getTextColor(event.status) }} className="event-status">
                  {event.status}
                </Text>
                <div className="event-detail">
                  🚘 {event.immatriculation} → 📍 {event.destination}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default ModelEvenementLive;
