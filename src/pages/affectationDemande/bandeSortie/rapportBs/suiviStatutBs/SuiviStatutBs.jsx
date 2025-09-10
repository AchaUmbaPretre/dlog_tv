import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Space,
  Typography,
  Tooltip,
  Skeleton,
  Empty,
  Button,
  DatePicker,
  Tag,
  Divider,
  message
} from "antd";
import {
  ReloadOutlined,
  CheckCircleTwoTone,
  RocketTwoTone,
  FlagTwoTone,
  ClockCircleTwoTone,
  StopTwoTone,
  InfoCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getRapportStatutPrincipaux } from "../../../../../../services/rapportService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const indicatorMeta = [
  {
    key: "bons_valides",
    title: "Bons validés",
    toneIcon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    progressStatus: "success",
    tagColor: "green",
    tooltip: "Bons au statut 'BS validé'",
  },
  {
    key: "departs_effectues",
    title: "Départs effectués",
    toneIcon: <RocketTwoTone twoToneColor="#597ef7" />,
    progressStatus: "normal",
    tagColor: "blue",
    tooltip: "Inclut 'Départ' et 'Départ sans BS'",
  },
  {
    key: "retours_confirmes",
    title: "Retours confirmés",
    toneIcon: <FlagTwoTone twoToneColor="#13c2c2" />,
    progressStatus: "active",
    tagColor: "cyan",
    tooltip: "Inclut 'Retour' et 'Retour sans BS'",
  },
  {
    key: "courses_non_parties",
    title: "Courses non parties",
    toneIcon: <ClockCircleTwoTone twoToneColor="#faad14" />,
    progressStatus: "exception",
    tagColor: "orange",
    tooltip: "En attente d'affectation/validation (statuts 1,2,3)",
  },
  {
    key: "courses_non_revenues",
    title: "Courses non revenues",
    toneIcon: <StopTwoTone twoToneColor="#ff4d4f" />,
    progressStatus: "exception",
    tagColor: "red",
    tooltip: "Départs non encore revenus (départs - retours)",
  },
];

const numberOrZero = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const SuiviStatutBs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(null);

  const total = useMemo(() => {
    if (!data) return 0;
    return (
      numberOrZero(data?.bons_valides?.nbre) +
      numberOrZero(data?.departs_effectues?.nbre) +
      numberOrZero(data?.retours_confirmes?.nbre) +
      numberOrZero(data?.courses_non_parties?.nbre) +
      numberOrZero(data?.courses_non_revenues?.nbre)
    );
  }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (range && range[0] && range[1]) {
        params.startDate = range[0].format("YYYY-MM-DD");
        params.endDate = range[1].format("YYYY-MM-DD");
      }

      const { data: resp } = await getRapportStatutPrincipaux(params);
      setData(resp);
    } catch (e) {
      console.error(e);
      setError(e);
      message.error("Erreur lors du chargement des statuts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const renderCard = (meta) => {
    const item = data?.[meta.key] || { nbre: 0, pourcentage: 0 };
    const value = numberOrZero(item.nbre);
    const percent = numberOrZero(item.pourcentage);

    return (
      <Card key={meta.key} bordered={false} style={{ height: "100%" }} bodyStyle={{ padding: 16 }}>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Tooltip title={meta.tooltip}>
              <Space size={8}>
                {meta.toneIcon}
                <Text strong>{meta.title}</Text>
                <InfoCircleOutlined style={{ opacity: 0.6 }} />
              </Space>
            </Tooltip>
            <Tag color={meta.tagColor}>{percent.toFixed(2)}%</Tag>
          </Space>

          <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Statistic value={value} suffix={<Text type="secondary">bons</Text>} valueStyle={{ fontWeight: 700 }} />
            <div style={{ width: 120 }}>
              <Progress
                type="dashboard"
                percent={Math.min(100, Math.max(0, percent))}
                status={meta.progressStatus}
                size={110}
              />
            </div>
          </Space>
        </Space>
      </Card>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <Card bordered={false} bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle" wrap>
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>Suivi des statuts – Bons de sortie</Title>
              <Text type="secondary">Vue synthétique pour pilotage opérationnel</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <RangePicker
                allowClear
                value={range}
                onChange={(vals) => setRange(vals)}
                format="YYYY-MM-DD"
              />
              <Button type="default" onClick={() => setRange([dayjs().startOf("day"), dayjs().endOf("day")])}>
                Aujourd'hui
              </Button>
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
                Actualiser
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Space size={24} wrap>
          <Tag color="default">Total (calculé): <b>{total}</b></Tag>
        </Space>
      </Card>

      {/* Content */}
      {loading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={i}>
              <Card bordered={false}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Card bordered={false}>
          <Empty description={<span>Impossible de charger les données</span>}>
            <Button onClick={fetchData} icon={<ReloadOutlined />}>Réessayer</Button>
          </Empty>
        </Card>
      ) : data ? (
        <Row gutter={[16, 16]}>
          {indicatorMeta.map((m) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={8} key={m.key}>
              {renderCard(m)}
            </Col>
          ))}
        </Row>
      ) : (
        <Card bordered={false}>
          <Empty description="Aucune donnée" />
        </Card>
      )}
    </div>
  );
};

export default SuiviStatutBs;
