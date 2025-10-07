import { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Typography,
  Space,
  Button,
  Spin,
  Empty,
  Tooltip,
  Badge,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { getAlertVehicule, markAlertAsRead } from "../../services/alertService";
import "./alertVehicule.scss";

const { Text } = Typography;

const AlertVehicule = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fonction pour récupérer les alertes
  const fetchAlerts = async () => {
    try {
      const { data } = await getAlertVehicule();
      setAlerts(data);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors du chargement des alertes");
    }
  };

  // 🔹 Marquer une alerte comme lue
  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      message.success("Alerte marquée comme lue ✅");
      setAlerts((prev) => prev.filter((a) => a.id !== id)); // Supprime localement
    } catch (error) {
      console.error(error);
      message.error("Impossible de mettre à jour l'alerte");
    }
  };

  // 🔹 Chargement initial + actualisation toutes les 5 secondes
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      await fetchAlerts();
      setLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      if (isMounted) {
        fetchAlerts();
      }
    }, 5000); // ⏱ actualisation toutes les 5 secondes

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="alert_vehicule">
      {loading ? (
        <div className="loading_state">
          <Spin size="large" />
          <Text type="secondary">Chargement des alertes...</Text>
        </div>
      ) : alerts.length === 0 ? (
        <Empty description="Aucune alerte disponible" />
      ) : (
        <div className="alert_wrapper">
          {/* 🔹 Titre avec compteur */}
          <div className="alert_title_row">
            <h2 className="alert_title">
              🚨 Alertes véhicules{" "}
              <Badge
                count={alerts.length}
                style={{ backgroundColor: "#f5222d", fontSize: 40, minWidth: 44, height: 44, display:'flex', alignItems:'center', justifyContent:'center' }}
                overflowCount={99}
              />
            </h2>
          </div>

          {/* 🔹 Liste des cartes */}
          <div className="alert_rows">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={`alert_card ${
                  alert.resolved ? "resolved" : "unresolved"
                }`}
                hoverable
                title={
                  <Space>
                    <Badge
                      status={alert.resolved ? "success" : "error"}
                      text={alert.alert_level}
                    />
                    <Tooltip title="Type d'alerte">
                      <AlertOutlined style={{ color: "#d4380d" }} />
                    </Tooltip>
                  </Space>
                }
                extra={
                  !alert.resolved && (
                    <Tooltip title="Marquer comme lue">
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Lu
                      </Button>
                    </Tooltip>
                  )
                }
              >
                <div className="alert_content">
                  <Space direction="vertical" size={6}>
                    <Text strong>{alert.alert_message}</Text>
                    <Text type="secondary">
                      <CarOutlined /> {alert.device_name}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined />{" "}
                      {new Date(alert.alert_time).toLocaleString("fr-FR")}
                    </Text>
                    <Tag color={alert.resolved ? "green" : "red"}>
                      {alert.resolved ? "Résolue" : "Non résolue"}
                    </Tag>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertVehicule;
