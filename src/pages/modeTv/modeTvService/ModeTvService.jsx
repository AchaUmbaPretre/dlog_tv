import React, { useEffect, useState } from "react";
import { Table, Progress } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CrownOutlined,
  CarOutlined,
  LineChartOutlined,
  MinusOutlined
} from "@ant-design/icons";
import "./modeTvService.scss";

const ModeTvService = ({dataService, courseVehicule, dataTendance, utilisationParc}) => {
  const [prevData, setPrevData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);

  // Données factices Leaderboard par service
  const leaderboardData = (dataService || []).map((item, index) => ({
    key: index + 1,
    service: item.nom_service,
    score: item.nbre_service,
  }));

  // Colonnes leaderboard
  const leaderboardCols = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (text, record, index) => (
        <span className="leaderboard_service">
          {index === 0 && <CrownOutlined className="crown_icon" />}
          {text}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Progress
          percent={score}
          size="small"
          strokeColor={score >= 85 ? "#52c41a" : score >= 70 ? "#faad14" : "#ff4d4f"}
          showInfo={false}
        />
      ),
    },
    {
      title: "%",
      dataIndex: "score",
      key: "percent",
      render: (score) => <b>{score}%</b>,
    },
  ];

  // Données Courses par chauffeur
  const coursesData = (courseVehicule || []).map((item, index) => ({
    key: index + 1,
    chauffeur : item.chauffeur,
    courses : item.courses
  }))

  const coursesCols = [
    {
      title: "Chauffeur",
      dataIndex: "chauffeur",
      key: "chauffeur",
      render: (text) => (
        <span className="chauffeur_name">
          <CarOutlined /> {text}
        </span>
      ),
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (val) => <b>{val}</b>,
    },
  ];

  // Données Mini-tendances
  useEffect(() => {
    if (!dataTendance) return;

const calcTrend = (current, prev) => {
  if (prev === null || prev === undefined) return { trend: "stable", diff: 0 };
  if (current > prev) return { trend: "up", diff: current - prev };
  if (current < prev) return { trend: "down", diff: prev - current };
  return { trend: "stable", diff: 0 };
};

const newTrends = [
  {
    key: 1,
    label: "Ponctualité Départ",
    value: `${dataTendance?.depart ?? 0}%`,
    badge: dataTendance?.departBadge ?? "",
    ...calcTrend(dataTendance?.depart, prevData?.depart),
  },
  {
    key: 2,
    label: "Ponctualité Retour",
    value: `${dataTendance?.retour ?? 0}%`,
    badge: dataTendance?.retourBadge ?? "",
    ...calcTrend(dataTendance?.retour, prevData?.ponctualite?.retour),
  },
  {
    key: 3,
    label: "Utilisation Parc",
    value: `${utilisationParc?.pourcentage ?? 0}%`,
    ...calcTrend(
      utilisationParc?.pourcentage,
      prevData?.pourcentage
    ),
  },
];


    setTrendsData(newTrends);
    setPrevData(dataTendance); // on garde la dernière valeur comme référence
  }, [dataTendance]);

  return (
    <div className="mode_service">
      {/* Leaderboard par service */}
      <div className="mode_service_card">
        <h3>🏆 Classement par service</h3>
        <Table
          dataSource={leaderboardData}
          columns={leaderboardCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Courses par chauffeur */}
      <div className="mode_service_card">
        <h3>🚗 Courses par chauffeur</h3>
        <Table
          dataSource={coursesData}
          columns={coursesCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Mini-tendances */}
      <div className="mode_service_card">
        <h3>📈 Mini-tendances</h3>
        <div className="trends_wrapper">
          {trendsData.map((item) => (
            <div key={item.key} className={`trend_item ${item.trend}`}>
              <LineChartOutlined />
              <span className="trend_label">{item.label}</span>
              <span className="trend_value">{item.value}</span>
              {item.trend === "up" && <ArrowUpOutlined style={{ color: "green" }} />}
              {item.trend === "down" && <ArrowDownOutlined style={{ color: "red" }} />}
              {item.trend === "stable" && <MinusOutlined style={{ color: "gray" }} />}
              {item.diff !== 0 && (
                <span className="trend_diff">
                  {item.trend === "up" ? "+" : "-"}
                  {item.diff}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeTvService;
