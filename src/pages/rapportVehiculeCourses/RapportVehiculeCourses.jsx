import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Tooltip,
  Space,
  Typography,
  Card,
  Divider,
} from "antd";
import {
  CarOutlined,
  ApartmentOutlined,
  UserOutlined,
  FieldTimeOutlined,
  EnvironmentOutlined,
  TrademarkOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { renderTextWithTooltip } from "../../utils/RenderTooltip";

const { Text } = Typography;

const renderDateTag = (dateStr, color = "blue") => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return (
    <Tag color={color} style={{ borderRadius: 6, fontWeight: 500 }}>
      {date.format("DD-MM-YYYY HH:mm")}
    </Tag>
  );
};

/* ------------------ HOOK ------------------ */
const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const diff = moment().diff(moment(startTime), "seconds");
      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) setElapsed(`${days}j ${hours}h`);
      else if (hours > 0) setElapsed(`${hours}h ${minutes}m`);
      else setElapsed(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
};

/* ------------------ COMPONENTS ------------------ */
const StatutSortieTag = ({ statut_sortie, date_retour }) => {
  const elapsed = useElapsedTime(date_retour);

  if (!statut_sortie) return <Tag>-</Tag>;

  let color = "green";
  let label = statut_sortie;
  let blinkClass = "";

  if (statut_sortie.includes("Retard") && date_retour) {
    const diffMinutes = moment().diff(moment(date_retour), "minutes");

    if (diffMinutes <= 30) color = "orange"; // léger
    else if (diffMinutes <= 60) color = "red"; // moyen
    else if (diffMinutes <= 48 * 60) {
      // sévère <48h
      color = "volcano";
      blinkClass = "blinking-tag";
    } else color = "grey"; // très long >48h

    label =
      diffMinutes > 48 * 60
        ? `${statut_sortie} (${Math.floor(diffMinutes / 60 / 24)}j)`
        : `${statut_sortie} (${elapsed})`;
  }

  return (
    <Tooltip
      title={date_retour ? moment(date_retour).format("DD/MM HH:mm") : "-"}
    >
      <Tag
        color={color}
        className={blinkClass}
        style={{
          fontWeight: 600,
          borderRadius: 6,
          padding: "2px 10px",
          fontSize: "0.9rem",
        }}
      >
        {label}
      </Tag>
    </Tooltip>
  );
};

const DureeRetardTag = ({ date_retour, duree_retard }) => {
  const elapsed = useElapsedTime(date_retour);
  const diffHours = moment().diff(moment(date_retour), "hours");
  const displayValue = diffHours >= 48 ? duree_retard : elapsed;

  const isLate = moment().isAfter(moment(date_retour));

  return (
    <Tooltip
      title={`Retour prévu : ${moment(date_retour).format(
        "DD/MM HH:mm"
      )} | Durée : ${duree_retard}`}
    >
      <Tag
        className={isLate && diffHours < 48 ? "blinking-tag" : ""}
        color={isLate && diffHours < 48 ? "red" : "green"}
        style={{ borderRadius: 6, padding: "2px 10px", fontSize: "0.9rem" }}
      >
        {displayValue}
      </Tag>
    </Tooltip>
  );
};

/* ------------------ MAIN TABLE ------------------ */
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
      title: "Immatriculation",
      dataIndex: "immatriculation",
      key: "immatriculation",
      align: "center",
      render: (text) => (
        <Tag color="magenta" style={{ fontSize: "0.85rem" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Marque",
      dataIndex: "nom_marque",
      key: "nom_marque",
      align: "center",
      render: (text) => (
        <Tag
          icon={<TrademarkOutlined />}
          color="blue"
          style={{ fontSize: "0.85rem" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Retour prévu",
      dataIndex: "date_retour",
      key: "date_retour",
      align: "center",
      render: (text) => renderDateTag(text),
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "orange" }} />
          <Text strong>Statut</Text>
        </Space>
      ),
      key: "statut_sortie",
      render: (_, record) => (
        <StatutSortieTag
          statut_sortie={record.statut_sortie}
          date_retour={record.date_retour}
        />
      ),
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: "purple" }} />
          <Text strong>Durée retard</Text>
        </Space>
      ),
      key: "duree_retard",
      align: "center",
      render: (_, record) => (
        <DureeRetardTag
          date_retour={record.date_retour}
          duree_retard={record.duree_retard}
        />
      ),
    },
  ];

  return (
    <div className="rapportVehiculeValide">
      <Card
        title={
          <Space>
            <CarOutlined style={{ color: "#1890ff" }} />
            <Text strong style={{ fontSize: "1.2rem" }}>
              Véhicules en course
            </Text>
          </Space>
        }
        extra={
          <Tooltip title="Plein écran">
            <FullscreenOutlined style={{ fontSize: 18, cursor: "pointer" }} />
          </Tooltip>
        }
        bordered={false}
        style={{ borderRadius: 12 }}
      >
        <Divider />
        <Table
          columns={columns}
          dataSource={course}
          rowKey={(record) => record.id_vehicule}
          pagination={{ pageSize: 15 }}
          scroll={{ x: "max-content" }}
          bordered
          size="large"
          rowHoverable
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeCourses;
