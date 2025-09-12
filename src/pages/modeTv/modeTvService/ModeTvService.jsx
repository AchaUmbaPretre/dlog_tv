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

const ModeTvService = ({dataService, courseVehicule, motif}) => {
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
      title: "Nombre",
      dataIndex: "courses",
      key: "courses",
      render: (val) => <b>{val}</b>,
    },
  ];

   const motifCols = [
    {
      title: "Motif",
      dataIndex: "nom_motif_demande",
      key: "nom_motif_demande",
      render: (text) => (
        <span className="chauffeur_name">
          {text}
        </span>
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nbre_course",
      key: "nbre_course",
      render: (val) => <b>{val}</b>,
    },
  ];

  return (
    <div className="mode_service">
      {/* Leaderboard par service */}
      <div className="mode_service_card">
        <h3>🏆 Utilisation par les services</h3>
        <Table
          dataSource={leaderboardData}
          columns={leaderboardCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Courses par chauffeur */}
      <div className="mode_service_card">
        <h3>🚗 Nbre de courses par chauffeurs</h3>
        <Table
          dataSource={coursesData}
          columns={coursesCols}
          pagination={false}
          size="small"
        />
      </div>

      {/* Mini-tendances */}
      <div className="mode_service_card">
        <h3>📈 Nbre de courses par Motif</h3>
        <div className="trends_wrapper">
          <Table
            dataSource={motif}
            columns={ motifCols}
            pagination={false}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default ModeTvService;
