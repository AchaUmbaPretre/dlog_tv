import {
  Table,
  Space,
  Typography,
  Card,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
  DashboardOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import {
  ChronoBox,
  EcartBox,
  MoyenneBox,
  TooltipBox,
} from "../../utils/RenderTooltip";
import './rapportVehiculeCourses.scss';
import { VehicleAddress } from "../../utils/vehicleAddress";

const { Text } = Typography;


// -------- Composant principal --------
const RapportVehiculeCourses = ({ course }) => {

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => (
        <Text style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>
          {index + 1}
        </Text>
      ),
      width: 70,
      align: "center",
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Motif</Text>
        </Space>
      ),
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => <TooltipBox text={text} bg="#333" />,
      ellipsis: true,
      width: 180,
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (_, record) => (
        <TooltipBox text={`${record.prenom_chauffeur || '-'} ${record.nom || '-'}`} bg="#333" />
      ),
      ellipsis: true,
      width: 180,
    },
    {
      title: (
        <Space>
          <EnvironmentFilled style={{ color: "red", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Position</Text>
        </Space>
      ),
      key: 'address',
      render: (_, record) => <VehicleAddress record={record} />,
      ellipsis: true,
      width: 200,
    },
    {
      title: (
        <Space>
          <DashboardOutlined style={{ color: "#fff", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Vitesse</Text>
        </Space>
      ),
      key: "speed",
      align: "center",
      render: (_, record) => {
        const speed = record?.capteurInfo?.speed || 0;
        const moteurOn = record?.capteurInfo?.engine_status === true;
        const color = speed > 120 ? 'red' : speed > 5 ? 'green' : speed > 0 ? 'orange' : 'red';
        const isCritical = speed > 120;
        const fontSize = Math.min(Math.max(20, speed / 2), 36);
        const radius = 55 + Math.min(speed / 5, 10);
        const strokeWidth = 10 + Math.min(speed / 20, 5);

        return (
          <div style={{ maxWidth: 90, margin: "0 auto", textAlign: 'center' }}>
            <svg viewBox="0 0 120 120" width="100%" height="100%">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="white"
                stroke={color}
                strokeWidth={strokeWidth}
                style={{ transition: "all 0.3s ease" }}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize={fontSize}
                fontWeight="bold"
                fill={color}
                style={{
                  animation: isCritical ? "blink 1s infinite" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {speed}
              </text>
              <text
                x="50%"
                y="75%"
                textAnchor="middle"
                fontSize="12"
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
            <Badge
              status={moteurOn ? "success" : "error"}
              text={moteurOn ? "ON" : "OFF"}
              style={{ fontSize: 16, color: moteurOn ? "green" : "red" }}
            />
          </div>
        );
      },
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => <TooltipBox text={text} bg="#333" />,
      ellipsis: true,
      width: 180,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>Véhicule</Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => <TooltipBox text={text} bg="#333" />,
      ellipsis: true,
      width: 150,
    },
    {
      title: "Durée réelle",
      key: "duree_reelle_min",
      align: "center",
      render: (_, record) =>
        <ChronoBox sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
    },
    {
      title: "Durée Moyenne",
      key: "duree_moyenne_min",
      align: "center",
      render: (_, record) =>
        <MoyenneBox duree_moyenne_min={record.duree_moyenne_min} />
    },
    {
      title: "Écart",
      key: "ecart_min",
      align: "center",
      render: (_, record) =>
        <EcartBox
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
    },
  ];

  return (
    <div className="rapportVehiculeCourses" style={{ padding: 20 }}>
      <Card
        title={
          <Space align="center">
            <CarOutlined style={{ color: "#1890ff", fontSize: 28 }} />
            <Text strong style={{ fontSize: 40, color: "#fff" }}>Véhicules en course</Text>
            <Badge
              count={course.length}
              style={{ backgroundColor: "#52c41a", fontSize: 20, minWidth: 44, height: 44 }}
            />
          </Space>
        }
        extra={
          <Tooltip title="Plein écran">
            <FullscreenOutlined style={{ fontSize: 24, cursor: "pointer", color: "#fff" }} />
          </Tooltip>
        }
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
          backgroundColor: "#1a1a1a",
        }}
      >
        <Divider style={{ margin: "14px 0", borderColor: "#444" }} />
        <Table
          columns={columns}
          dataSource={course}
          rowKey={(record) => record.id_vehicule}
          pagination={{ pageSize: 15 }}
          scroll={{ x: "max-content" }}
          bordered={false}
          size="middle"
          rowClassName={(record) =>
            record.en_cours ? "row-en-cours" : ""
          }
        />
      </Card>
      <style jsx>{`
        .row-en-cours {
          background-color: rgba(82, 196, 26, 0.1);
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeCourses;
