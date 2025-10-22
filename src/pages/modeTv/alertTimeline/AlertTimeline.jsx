import { useEffect, useState } from "react";
import { Timeline, Tooltip, Card, Badge, Spin, Empty, message } from "antd";
import {
  CarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./alertTimeline.scss";
import { getAlertVehicule, markAlertAsRead } from "../../../services/alertService";

const AlertTimeline = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    try {
      const { data } = await getAlertVehicule();
      setAlerts(data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des alertes");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      message.success("Alerte marquée comme lue ✅");
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      message.error("Impossible de mettre à jour l'alerte");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      await fetchAlerts();
      setLoading(false);
    };
    loadData();

    const interval = setInterval(() => {
      if (isMounted) fetchAlerts();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getIconColor = (level, resolved) => {
    if (resolved) return "#52c41a";
    switch (level) {
      case "Critique":
        return "#ff4d4f";
      case "Important":
        return "#fa8c16";
      default:
        return "#1890ff";
    }
  };

  const getBadgeColor = (level) => {
    switch (level) {
      case "Critique":
        return "red";
      case "Important":
        return "orange";
      default:
        return "blue";
    }
  };

  return (
    <div className="alert-timeline-container">
      <Card
        title={
          <span className="card-title">
            🚨 Alertes véhicules{" "}
            <Badge
              count={alerts.length}
              style={{
                backgroundColor: "#f5222d",
                fontSize: 18,
                minWidth: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </span>
        }
        bordered={false}
        className="alert-card"
      >
        {loading ? (
          <div className="loading-state">
            <Spin size="large" />
            <span>Chargement des alertes...</span>
          </div>
        ) : alerts.length === 0 ? (
          <Empty description="Aucune alerte disponible" />
        ) : (
          <Timeline mode="left" className="alert-timeline">
            {alerts.map((alert) => (
              <Timeline.Item
                key={alert.id}
                dot={
                  alert.resolved ? (
                    <CheckCircleOutlined
                      style={{ fontSize: 20, color: getIconColor("", true) }}
                    />
                  ) : (
                    <AlertOutlined
                      style={{
                        fontSize: 20,
                        color: getIconColor(alert.alert_level, false),
                        transition: "all 0.3s",
                      }}
                    />
                  )
                }
              >
                <div
                  className={`alert-content ${alert.resolved ? "resolved" : "unresolved"}`}
                >
                  <div className="alert-header">
                    <strong>{alert.device_name}</strong>
                    {!alert.resolved && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Marquer comme lue
                      </button>
                    )}
                  </div>
                  <div className="alert-message">
                    <CarOutlined /> {alert.alert_message}
                  </div>
                  <div className="alert-footer">
                    <Tooltip title="Heure de l'alerte">
                      <span>{moment(alert.alert_time).format("DD/MM/YYYY HH:mm")}</span>
                    </Tooltip>
                    <Badge
                      color={getBadgeColor(alert.alert_level)}
                      text={alert.resolved ? "Résolue" : alert.alert_level}
                    />
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default AlertTimeline;
