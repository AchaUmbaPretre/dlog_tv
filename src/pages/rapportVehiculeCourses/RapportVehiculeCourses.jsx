import {
  Table,
  Space,
  Typography,
  Card,
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
  FieldTimeOutlined
} from "@ant-design/icons";
import {
  ChronoBox,
  EcartBox,
  MoyenneBox,
  TooltipBox,
} from "../../utils/RenderTooltip";
import { VehicleAddress } from "../../utils/vehicleAddress";
import VehicleSpeed from "../../utils/vehicleSpeed";
import './rapportVehiculeCourses.scss';

const { Text } = Typography;

const RapportVehiculeCourses = ({ course }) => {

  const hasPosition = course?.some((r) => !!r?.position || !!r?.capteurInfo?.address);
  const hasSpeed = course?.some((r) => r?.capteurInfo?.speed !== undefined);

  let columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => (
        <Text style={{ fontSize: 40, fontWeight: 900 }}>{index + 1}</Text>
      ),
      width: 70,
      align: "center",
      fixed: 'left',
    },
    {
      title: (
        <Space>
          <AppstoreOutlined style={{ color: "#1890ff", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Motif</Text>
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
          <UserOutlined style={{ color: "orange", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (_, record) => (
        <TooltipBox text={`${record.prenom_chauffeur || "-"} ${record.nom || "-"}`} bg="#333" />
      ),
      ellipsis: true,
      width: 180,
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => <TooltipBox text={text} bg="#333" maxWidth={400} />,
      ellipsis: false,
      width: 250,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Véhicule</Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => <TooltipBox text={text} bg="#333" />,
      ellipsis: true,
      width: 150,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "green", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Durée R.</Text>
        </Space>
      ),
      key: "duree_reelle_min",
      align: "center",
      render: (_, record) => <ChronoBox sortie_time={record.sortie_time} date_prevue={record.date_prevue} />,
      ellipsis: true,
      width: 200,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "yellow", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Durée M</Text>
        </Space>
      ),
      key: "duree_moyenne_min",
      align: "center",
      render: (_, record) => <MoyenneBox duree_moyenne_min={record.duree_moyenne_min} />,
      ellipsis: true,
      width: 200,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "blue", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Écart</Text>
        </Space>
      ),
      key: "ecart_min",
      align: "center",
      render: (_, record) => <EcartBox duree_reelle_min={record.duree_reelle_min} duree_moyenne_min={record.duree_moyenne_min} />,
      ellipsis: true,
      width: 120,
    },
  ];

  if (hasPosition) {
    columns.splice(3, 0, {
      title: (
        <Space>
          <EnvironmentFilled style={{ color: "red", fontSize: 45 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Position</Text>
        </Space>
      ),
      key: "address",
      render: (_, record) => <VehicleAddress record={record} />,
      ellipsis: true,
      width: 100,
    });
  }

  if (hasSpeed) {
    columns.splice(hasPosition ? 4 : 3, 0, {
      title: (
        <Space>
          <DashboardOutlined style={{ color: "#fff", fontSize: 40 }} />
          <Text strong style={{ fontSize: 50, color: "#fff" }}>Vitesse</Text>
        </Space>
      ),
      key: "speed",
      align: "center",
      render: (_, record) => (
        <VehicleSpeed speed={record?.capteurInfo?.speed || 0} engineOn={record?.capteurInfo?.engine_status === true} />
      ),
      ellipsis: true,
      width: 250,
    });
  }

  return (
    <div className="rapportVehiculeCourses">
      <Card
        title={(
          <Space align="center">
            <CarOutlined style={{ color: "#1890ff", fontSize: 45 }} />
            <Text strong style={{ fontSize: 50, color: "#fff" }}>Véhicules en course</Text>
            <Badge
              count={course.length}
              style={{ backgroundColor: "#52c41a", fontSize: 40, minWidth: 44, height: 44, display:'flex', alignItems:'center', justifyContent:'center' }}
            />
          </Space>
        )}
        extra={(
          <Tooltip title="Plein écran">
            <FullscreenOutlined style={{ fontSize: 30, cursor: "pointer", color: "#fff" }} />
          </Tooltip>
        )}
        bordered={false}
      >
        <div className="table-scroll">
          <Table
            columns={columns}
            dataSource={course}
            rowKey={(record) => record.id_vehicule}
            pagination={{ pageSize: 15 }}
            scroll={{ x: "max-content" }}
            bordered={false}
            size="middle"
            rowClassName={(record) => record.en_cours ? "row-en-cours" : ""}
          />
        </div>
      </Card>
    </div>
  );
};

export default RapportVehiculeCourses;
