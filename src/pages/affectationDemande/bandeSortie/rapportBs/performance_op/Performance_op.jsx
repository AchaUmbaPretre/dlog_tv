import { useEffect, useState } from "react"; 
import {
  Card,
  Table,
  Row,
  Col,
  Statistic,
  Progress,
  message,
  Spin,
  Input,
  Typography,
  Badge,
  Divider,
  Button
} from "antd";
import { DashboardOutlined, FilterOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";
import { getRapportBonPerformance } from "../../../../../../services/rapportService";
import FilterBs from "../filterBs/FilterBs";
import PerformanceBar from "./performanceBar/PerformanceBar";

const { Search } = Input;
const { Title } = Typography;

const PerformanceOp = () => {
  const [vehicule, setVehicule] = useState([]);
  const [chauffeur, setChauffeur] = useState([]);
  const [dureeData, setDureeData] = useState([]);
  const [tauxData, setTauxData] = useState({ taux_retour_delais: 0 });
  const [sortieTotal, setSortieTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const scroll = { x: 400 };
  const [searchDestination, setSearchDestination] = useState("");
  const [filters, setFilters] = useState({
    vehicule: [], service: [], destination: [], dateRange: [],
  });
  const [showFilter, setShowFilter] = useState(false); 
  
  const fetchData = async (filter) => {
    try {
      setLoading(true);
      const { data } = await getRapportBonPerformance(filter);
      setVehicule(data.vehiculeData || []);
      setChauffeur(data.chauffeurData || []);
      setDureeData(data.dureeData || []);
      setTauxData(data.tauxData || { taux_retour_delais: 0 });
      setSortieTotal(data.sortieTotal || []);
    } catch (error) {
      message.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters)
  }, [filters]);

  // Totaux pour dureeData
  const totalHeures = dureeData.reduce((acc, curr) => acc + curr.duree_totale_heures, 0);
  const totalJours = dureeData.reduce((acc, curr) => acc + curr.duree_totale_jours, 0);
  const totalSorties = sortieTotal.length;

  const filteredDureeData = dureeData.filter(d => d.nom_destination.toLowerCase().includes(searchDestination.toLowerCase()));
  const graphData = dureeData.map(c => ({ destination: c.nom_destination, duree: parseFloat(c.duree_moyenne_heures) || 0 }));

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
        <div style={{marginBottom:'16px', textAlign:'right'}}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Masquer le filtre" : "Afficher le filtre"}
          </Button>
        </div>
      {/* Filtrage */}
      <div style={{ marginBottom: 24 }}>
        { showFilter && <FilterBs onFilter={setFilters} />}
      </div>

      <Spin spinning={loading} tip="Chargement des données..." size="large">
        {/* KPI Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transition: "all 0.3s", height: "100%" }}>
              <Statistic
                title="Taux retour dans les délais"
                value={tauxData.taux_retour_delais || 0}
                precision={2}
                suffix="%"
              />
              <Progress percent={tauxData.taux_retour_delais || 0} strokeColor={{ from: "#108ee9", to: "#87d068" }} strokeWidth={14} />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transition: "all 0.3s", height: "100%" }}>
              <Statistic
                title="Véhicules mobilisés"
                value={vehicule.length}
                prefix={<CarOutlined style={{ color: vehicule.length > 10 ? "green" : "red" }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transition: "all 0.3s", height: "100%" }}>
              <Statistic
                title="Chauffeurs mobilisés"
                value={chauffeur.length}
                prefix={<UserOutlined style={{ color: chauffeur.length > 10 ? "green" : "red" }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", transition: "all 0.3s", height: "100%" }}>
              <Statistic
                title="Sorties totales"
                value={totalSorties}
                prefix={<DashboardOutlined style={{ color: totalSorties > 50 ? "green" : "orange" }} />}
              />
              <Badge count={totalSorties} style={{ backgroundColor: "#1890ff", marginTop: 8 }} />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Graphique et tableaux */}
        <Card title={<Title level={4}>Performance opérationnelle</Title>} bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {/* Graphique barres */}
          <PerformanceBar graphData={graphData} />

          {/* Tableau duréeData */}
          <Card type="inner" title="Durée des courses par destination">
            <Search 
              placeholder="Rechercher destination" 
              onChange={e => setSearchDestination(e.target.value)} 
              style={{ marginBottom: 12, width: 300 }} 
              allowClear 
            />
            <Table
              dataSource={filteredDureeData}
              rowKey={(record, index) => index}
              pagination={{ pageSize: 5 }}
              bordered
              scroll={scroll}
              columns={[
                { title: "#", render: (_, __, index) => index + 1 },
                { title: "Destination", dataIndex: "nom_destination" },
                { 
                  title: "Durée moyenne (h)", 
                  dataIndex: "duree_moyenne_heures", 
                  sorter: (a, b) => a.duree_moyenne_heures - b.duree_moyenne_heures,
                  render: value => {
                    const color = value >=5 ? "green" : value >=2 ? "orange" : "red";
                    return <span style={{ color, fontWeight: "bold" }}>{value}</span>;
                  }
                },
                { title: "Durée totale (h)", dataIndex: "duree_totale_heures", sorter: (a, b) => a.duree_totale_heures - b.duree_totale_heures },
                { title: "Durée totale (j)", dataIndex: "duree_totale_jours", sorter: (a, b) => a.duree_totale_jours - b.duree_totale_jours },
                { title: "Nbre sortie", dataIndex:"total_sorties", sorter: (a, b) => a.total_sorties - b.total_sorties}
              ]}
              footer={() => (
                <div style={{ fontWeight: "bold" }}>
                  Totaux : {totalHeures.toFixed(2)} h / {totalJours.toFixed(2)} j / {totalSorties} sorties
                </div>
              )}
            />
          </Card>
        </Card>
      </Spin>
    </div>
  );
};

export default PerformanceOp;
