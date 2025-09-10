import { useEffect, useState } from 'react';
import { Card, Divider, Row, Col, Statistic, Skeleton, notification, Tooltip } from 'antd';
import {
  FileTextOutlined,
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { getRapportBonGlobal } from '../../../../../../services/rapportService';
import VehiculeBarChart from './vehiculeBarChart/VehiculeBarChart';
import ServicePieChart from './servicePieChart/ServicePieChart';

const VolumeGlobal = () => {
  const [globals, setGlobals] = useState({});
  const [vehicules, setVehicules] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [globalData] = await Promise.all([getRapportBonGlobal()]);
      setGlobals(globalData.data.global || {});
      setVehicules(globalData.data.repartitionVehicule || []);
      setServices(globalData.data.repartitionService || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const KPIs = [
  {
    icon: <FileTextOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
    label: 'Nbre bons',
    value: globals.total_bons || 0,
    bg: 'rgba(82, 196, 26, 0.15)',
  },
  {
    icon: <CarOutlined style={{ fontSize: 28, color: '#faad14' }} />,
    label: 'Nbre véhicules',
    value: globals.total_vehicules || 0,
    bg: 'rgba(250, 173, 20, 0.15)',
  },
  {
    icon: <UserOutlined style={{ fontSize: 28, color: '#eb2f96' }} />,
    label: 'Nbre chauffeurs',
    value: globals.total_chauffeurs || 0,
    bg: 'rgba(235, 47, 150, 0.15)',
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#1890ff' }} />,
    label: 'Durée moyenne',
    value: globals.temps_moyen_minutes
      ? `${globals.temps_moyen_minutes} min`
      : '—',
    extra: globals.temps_moyen_heures
      ? `≈ ${globals.temps_moyen_heures} h`
      : '',
    bg: 'rgba(24, 144, 255, 0.15)',
  },
];


  return (
    <div className="volume-global">
      {/* KPI Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {KPIs.map((kpi, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              className="kpi_card"
              hoverable
              style={{
                textAlign: 'center',
                height: '100%',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {loading ? (
                <Skeleton active paragraph={false} />
              ) : (
                <>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: kpi.bg, // couleur semi-transparente
                      marginBottom: 12,
                    }}
                  >
                    {kpi.icon}
                  </div>
                  <Statistic
                    value={kpi.value}
                    valueStyle={{
                      fontSize: 24,
                      fontWeight: 600,
                    }}
                  />
                  <div style={{ marginTop: 8, color: '#595959' }}>
                    {kpi.label}
                  </div>
                  {kpi.extra && (
                    <Tooltip title="Valeur arrondie en heures">
                      <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                        {kpi.extra}
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      
      <Divider />

      {/* Tabular Breakdown */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <Card
            title="Répartition par type de véhicule"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : vehicules.length > 0 ? (
              vehicules.map((v, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{v.nom_cat}</Col>
                  <Col>
                    <strong>{v.nbre}</strong>
                  </Col>
                </Row>
              ))
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Répartition par service"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : services.length > 0 ? (
              services.map((s, idx) => (
                <Row key={idx} justify="space-between" className="row_item">
                  <Col>{s.nom_service}</Col>
                  <Col>
                    <strong>{s.nbre}</strong>
                  </Col>
                </Row>
              ))
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Graphical Insights */}
      <Divider
        orientation="left"
        style={{ fontWeight: 600, marginTop: 40 }}
      >
        Visualisations dynamiques
      </Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Graphique : Répartition par type de véhicule"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : vehicules.length > 0 ? (
              <VehiculeBarChart data={vehicules} />
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Graphique : Répartition par service"
            type="inner"
            className="inner_card"
            bodyStyle={{ padding: '16px 24px' }}
          >
            {loading ? (
              <Skeleton active />
            ) : services.length > 0 ? (
              <ServicePieChart data={services} />
            ) : (
              <div>Aucune donnée disponible.</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VolumeGlobal;
