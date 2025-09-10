import { Card, Row, Col, Statistic, Tooltip, Typography, Divider, Badge, Button } from "antd";
import {
  CarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import MouvementFilter from "./mouvementFilter/MouvementFilter";
import "./mouvementVehicule.scss";
import { useEffect, useState } from "react";
import { getMouvementVehicule } from "../../../../../../services/rapportService";
import { useSelector } from "react-redux";

const { Title } = Typography;

const MouvementVehicule = () => {
  const [data, setData] = useState(null);
  const [showFilter, setShowFilter] = useState(false); 
  const [filters, setFilters] = useState({});  
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  

  const fetchData = async(filters) => {
    try {
      const res = await getMouvementVehicule({...filters, userId});
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  fetchData(filters);

  const interval = setInterval(() => {
    fetchData(filters);
  }, 5000);

  return () => clearInterval(interval);
}, [filters, userId]);

  const parseRatio = (str) => {
    if (!str) return [0, 0];
    const parts = str.split("/").map((v) => parseInt(v.trim(), 10));
    return parts.length === 2 ? parts : [0, 0];
  };

  // --- Extraction sécurisée des valeurs ---
  const [bonsValides, totalBons] = parseRatio(data?.bons_valides);
  const [departsEffectues, totalDeparts] = parseRatio(data?.departs_effectues);
  const [retoursConfirmes, totalRetours] = parseRatio(data?.retours_confirmes);
  const vehiculesHorsSite = data?.vehicules_hors_site ?? 0;
  const vehiculesDispo = data?.vehicules_disponibles ?? 0;
  const bonEnAttente = data?.bons_en_attente  ?? 0;

  const getColor = (label) => {
    if (label.includes("hors timing")) return "orange";
    if (label.includes("annulées")) return "red";
    if (label.includes("validés") || label.includes("effectués") || label.includes("confirmés")) return "success";
    return "blue";
  };

  const stats = [
    {
      title: "Bons en attente",
      value: bonEnAttente,
      icon: <FileTextOutlined />,
      tooltip: "Nombre total de bons en attente de validation",
      className: "attente",
    },
    {
      title: "Véhicules hors site",
      value: vehiculesHorsSite,
      icon: <CarOutlined />,
      tooltip: "Véhicules actuellement hors site",
      className: "hors_site",
    },
    {
      title: "Disponibles",
      value: vehiculesDispo,
      icon: <CheckCircleOutlined />,
      tooltip: "Véhicules disponibles sur site",
      className: "dispo",
    },
  ];

  const miniStats = [
    { value: `${bonsValides} / ${totalBons}`, label: "Bons validés", icon: <CheckCircleOutlined /> },
    { value: `${departsEffectues} / ${totalDeparts}`, label: "Départs effectués", icon: <CarOutlined /> },
    { value: `${retoursConfirmes} / ${totalRetours}`, label: "Retours confirmés", icon: <RollbackOutlined /> },
    { value: data?.departs_hors_timing ?? "0 / 0", label: "Départs hors timing", icon: <ClockCircleOutlined /> },
    { value: data?.retours_hors_timing ?? "0 / 0", label: "Retours hors timing", icon: <ExclamationCircleOutlined /> },
    { value: data?.courses_annulees ?? "0 / 0", label: "Courses annulées", icon: <CloseCircleOutlined /> },
  ];

  return (
    <div className="mouvement_vehicule">
      <div className="mouv_vehicule_wrapper">
        {/* Bouton toggle filtre */}
        <div className="filter_toggle">
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Masquer le filtre" : "Afficher le filtre"}
          </Button>
        </div>

        {/* Filtre affiché seulement si showFilter === true */}
        {showFilter && <MouvementFilter onFilter={setFilters}  />}

        {/* Statistiques principales */}
        <Row gutter={[24, 24]} className="mouv_vehicule_row">
          {stats.map((stat, index) => (
            <Col xs={24} md={8} key={index}>
              <Tooltip title={stat.tooltip}>
                <Card bordered={false} className={`mouv_vehicule_card ${stat.className}`}>
                  <div className="card_icon">{stat.icon}</div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>

        <Divider />
        <Title level={4} className="mouv_h3">Compteur absolu</Title>

        <Row gutter={[16, 16]} className="mouv_cards_row">
          {miniStats.map((item, index) => (
            <Col xs={12} md={8} lg={4} key={index}>
              <Badge.Ribbon
                text={item.label.includes("hors timing") || item.label.includes("annulées") ? "⚠️" : ""}
                color={getColor(item.label)}
              >
                <Card bordered={false} className={`mini_stat_card ${getColor(item.label)}`}>
                  <div className="mini_icon">{item.icon}</div>
                  <Statistic value={item.value} valueStyle={{ fontSize: 20, fontWeight: 600 }} />
                  <div className="mini_stat_label">{item.label}</div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MouvementVehicule;
