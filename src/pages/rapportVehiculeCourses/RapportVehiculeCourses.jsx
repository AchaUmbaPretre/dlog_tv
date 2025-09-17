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
  ApartmentOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import {
  ChronoBox,
  EcartBox,
  MoyenneBox,
  TooltipBox,
} from "../../utils/RenderTooltip";
import './rapportVehiculeCourses.scss'

const { Text } = Typography;

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
          <Text strong style={{ fontSize: 32, color: "#fff" }}>
            Motif
          </Text>
        </Space>
      ),
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => <TooltipBox text={text} bg="#333" />,
    },
/*     {
      title: (
        <Space>
          <ApartmentOutlined style={{ color: "#1d39c4", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>
            Service
          </Text>
        </Space>
      ),
      dataIndex: "nom_service",
      key: "nom_service",
      render: (text) => <TooltipBox text={text} bg="#333" />,
    }, */
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>
            Chauffeur
          </Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (text, record) =>
        <TooltipBox text={`${record.prenom_chauffeur || '-'} ${record.nom || '-'}`} bg="#333" />
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>
            Destination
          </Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => <TooltipBox text={text} bg="#333" />,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green", fontSize: 28 }} />
          <Text strong style={{ fontSize: 32, color: "#fff" }}>
            Véhicule
          </Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => <TooltipBox text={text} bg="#333" />,
    },
    {
      title: "Durée réelle",
      key: "duree_reelle_min",
      align: "center",
      render: (_, record) => (
        <ChronoBox sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
    },
    {
      title: "Durée Moyenne",
      key: "duree_moyenne_min",
      align: "center",
      render: (_, record) => <MoyenneBox duree_moyenne_min={record.duree_moyenne_min} />,
    },
    {
      title: "Écart",
      key: "ecart_min",
      align: "center",
      render: (_, record) => (
        <EcartBox
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
      ),
    },
  ];

  return (
    <div className="rapportVehiculeCourses" style={{ padding: 20 }}>
      <Card
        title={
          <Space align="center">
            <CarOutlined style={{ color: "#1890ff", fontSize: 28 }} />
            <Text strong style={{ fontSize: "34px", color: "#fff" }}>
              Véhicules en course
            </Text>
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
          background-color: rgba(82, 196, 26, 0.1); /* vert léger pour cours */
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeCourses;
