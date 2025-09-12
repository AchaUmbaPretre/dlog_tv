import {
  Table,
  Tooltip,
  Space,
  Typography,
  Card,
  Divider,
  Badge,
} from "antd";
import {
  CarOutlined,
  ApartmentOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { ChronoTag, EcartTag, MoyenneTag, renderTextWithTooltip } from "../../utils/RenderTooltip";

const { Text } = Typography;

const RapportVehiculeCourses = ({ course }) => {
  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff" }} />
          <Text strong>Motif</Text>
        </Space>
      ),
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <ApartmentOutlined style={{ color: "#1d39c4" }} />
          <Text strong>Service</Text>
        </Space>
      ),
      dataIndex: "nom_service",
      key: "nom_service",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange" }} />
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red" }} />
          <Text strong>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green" }} />
          <Text strong>Véhicule</Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => renderTextWithTooltip(text),
    },
    {
      title: "Durée réelle",
      key: "duree_reelle_min",
      render: (_, record) => (
        <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
    },
    {
      title: "Durée Moyenne",
      key: "duree_moyenne_min",
      render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
    },
    {
      title: "Écart",
      key: "ecart_min",
      render: (_, record) => (
        <EcartTag
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
      ),
    },
  ];

  return (
    <div className="rapportVehiculeValide" style={{ padding: 12 }}>
      <Card
        title={
          <Space align="center">
            <CarOutlined style={{ color: "#1890ff", fontSize: 22 }} />
            <Text strong style={{ fontSize: "1.3rem" }}>
              Véhicules en course
            </Text>
            <Badge
              count={course.length}
              style={{ backgroundColor: "#52c41a", fontSize: 14 }}
            />
          </Space>
        }
        extra={
          <Tooltip title="Plein écran">
            <FullscreenOutlined style={{ fontSize: 20, cursor: "pointer" }} />
          </Tooltip>
        }
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Divider style={{ margin: "12px 0" }} />
        <Table
          columns={columns}
          dataSource={course}
          rowKey={(record) => record.id_vehicule}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
          rowClassName={(record) =>
            record.en_cours ? "table-row-en-cours" : ""
          }
        />
      </Card>
      <style jsx>{`
        .table-row-en-cours {
          background-color: #f6ffed; /* Vert clair pour les véhicules en cours */
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeCourses;
