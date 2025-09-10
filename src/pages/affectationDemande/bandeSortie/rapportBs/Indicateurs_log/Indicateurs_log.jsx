import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Card, Row, Col, Statistic, Space, Typography, Tooltip,
  Skeleton, Empty, Button, Divider, Badge, message
} from 'antd';
import {
  ReloadOutlined, FilterOutlined, InfoCircleOutlined, DashboardOutlined,
  ClockCircleOutlined, AppstoreOutlined, ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import { getRapportIndicateurLog } from '../../../../../../services/rapportService';
import FilterBs from '../filterBs/FilterBs';

const { Text } = Typography;

const IndicateursLog = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    vehicule: [], service: [], destination: [], dateRange: [],
  });
  const [showFilter, setShowFilter] = useState(false); 
  

  const numberOrZero = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

  const fetchData = useCallback(async (appliedFilters) => {
    try {
      setLoading(true);
      setError(null);
      const { data: resp } = await getRapportIndicateurLog(appliedFilters);
      setData(resp);
    } catch (err) {
      console.error(err);
      setError(err);
      message.error('Erreur lors du chargement des indicateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(filters); }, [filters, fetchData]);

  const totalCourses = useMemo(() => numberOrZero(data?.nb_ot), [data]);

  const getBadgeStatus = (value) => {
    if (value > 80) return 'success';
    if (value > 50) return 'warning';
    return 'error';
  };

  const renderCard = useCallback((title, value, tooltip, icon = <DashboardOutlined />, extra = null) => (
    <Card
      bordered={false}
      hoverable
      style={{
        borderRadius: 14,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        transition: 'transform 0.4s, box-shadow 0.4s',
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff, #f0f5ff)',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {icon}
            <Tooltip title={tooltip}>
              <Text strong style={{ fontSize: 16 }}>{title}</Text>
              <InfoCircleOutlined style={{ color: '#8c8c8c', marginLeft: 4 }} />
            </Tooltip>
          </Space>
          {extra}
        </Space>
        <Statistic
          value={numberOrZero(value)}
          valueStyle={{ fontWeight: 700, fontSize: 30, color: '#1d39c4' }}
        />
      </Space>
    </Card>
  ), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* --- Header / Filtres --- */}
      <Card
        bordered={false}
        bodyStyle={{ padding: 24, borderRadius: 14, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
      >
        <div style={{marginBottom:'16px', textAlign:'right'}}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Masquer le filtre" : "Afficher le filtre"}
          </Button>
        </div>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={24} style={{ textAlign: 'right' }}>
           { showFilter && <FilterBs onFilter={setFilters} />}
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Text strong style={{ fontSize: 16 }}>Total courses: <span style={{ color: '#1d39c4' }}>{totalCourses}</span></Text>
      </Card>

      {/* --- KPI Cards --- */}
      {loading ? (
        <Row gutter={[24, 24]} justify="center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={i}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Card bordered={false}>
          <Empty description="Impossible de charger les données">
            <Button onClick={() => fetchData(filters)} icon={<ReloadOutlined />}>Réessayer</Button>
          </Empty>
        </Card>
      ) : data ? (
        <>
          {/* Totaux principaux */}
          <Row gutter={[24, 24]} justify="center" style={{display:'flex', gap:'20px'}}>
            {renderCard(
              'Nombre total de bons de sortie',
              data.nb_ot,
              'Total des bons de sortie émis',
              <AppstoreOutlined />,
              <Badge count={numberOrZero(data.nb_ot)} style={{ backgroundColor: '#52c41a', boxShadow: '0 0 0 2px white' }} />
            )}
            {renderCard(
              'Taux d\'utilisation du parc',
              data.taux_utilisation_parc,
              'Pourcentage d\'utilisation du parc',
              <DashboardOutlined />,
              <Badge status={getBadgeStatus(data.taux_utilisation_parc)} text={`${numberOrZero(data.taux_utilisation_parc)}%`} />
            )}
          </Row>

          {/* Top destinations */}
          <Divider orientation="left">Top destinations & Temps moyen</Divider>
          <Row gutter={[24, 24]} justify="center">
            {data.top_destinations?.map((d, i) => {
              const delta = numberOrZero(d.nb_courses) - numberOrZero(d.nb_courses_prev);
              return (
                <Col xs={24} sm={12} md={12} lg={8} xl={8} key={i}>
                  <Card
                    bordered={false}
                    hoverable
                    style={{
                      borderRadius: 16,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, #ffffff, #e6f7ff)',
                    }}
                  >
                    <Space direction="vertical" size={10} style={{ width: '100%' }}>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Text strong style={{ fontSize: 16 }}>
                          <ClockCircleOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                          {d.nom_destination}
                        </Text>
                        {delta !== 0 && (
                          <Tooltip title={`Évolution par rapport à la période précédente: ${delta > 0 ? '+' : ''}${delta}`}>
                            {delta > 0 ? <ArrowUpOutlined style={{ color: '#cf1322' }} /> : <ArrowDownOutlined style={{ color: '#3f8600' }} />}
                          </Tooltip>
                        )}
                      </Space>

                      <Statistic
                        title="Nombre de courses"
                        value={numberOrZero(d.nb_courses)}
                        valueStyle={{ fontWeight: 700, fontSize: 24 }}
                      />

                      <Statistic
                        title="Temps moyen"
                        value={`${numberOrZero(d.duree_moyenne_minutes)} min (${numberOrZero(d.duree_moyenne_heures)} h)`}
                        valueStyle={{ color: '#096dd9', fontSize: 20, fontWeight: 600 }}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Volume par service */}
          <Divider orientation="left">Volume courses par service</Divider>
          <Row gutter={[24, 24]} justify="center">
            {data.volume_courses_par_service?.map((s, i) => (
              <Col xs={24} sm={12} md={12} lg={8} xl={8} key={i}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    borderRadius: 16,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #ffffff, #f9f0ff)',
                  }}
                >
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 16 }}>
                      <AppstoreOutlined style={{ marginRight: 6, color: '#722ed1' }} />
                      {s.nom_service}
                    </Text>

                    <Statistic
                      title="Nombre de courses"
                      value={numberOrZero(s.nb_courses)}
                      valueStyle={{ fontWeight: 700, fontSize: 22 }}
                    />

                    <Statistic
                      title="Temps moyen"
                      value={`${numberOrZero(s.temps_moyen_minutes)} min`}
                      valueStyle={{ color: '#722ed1', fontSize: 20, fontWeight: 600 }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Card bordered={false}>
          <Empty description="Aucune donnée" />
        </Card>
      )}
    </div>
  );
};

export default IndicateursLog;
