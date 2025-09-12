import { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './modeTvCardPonct.scss';

const ModeTvCardPonct = ({ datas }) => {
  const [data, setData] = useState({
    depart: 0,
    departTrend: 'up',
    attente: 0,
    attenteTrend: 'up',
    dispo: 0,
    dispoTrend: 'up',
  });

  useEffect(() => {
    if (!datas) return;

    setData((prev) => {
      const newDepart = Math.round(datas.depart || 0);
      const newAttente = Math.round(datas.attente || 0);
      const newDispo = Math.round(datas.vehicule_dispo || 0);

      return {
        depart: newDepart,
        departTrend: newDepart >= prev.depart ? 'up' : 'down',
        attente: newAttente,
        attenteTrend: newAttente >= prev.attente ? 'up' : 'down',
        dispo: newDispo,
        dispoTrend: newDispo >= prev.dispo ? 'up' : 'down',
      };
    });
  }, [datas]);

  const renderTrend = (trend) => (
    <div className={`tv_trend ${trend}`}>
      {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      <span>{trend === 'up' ? 'En hausse' : 'En baisse'}</span>
    </div>
  );

  const getStrokeColor = (value) =>
    value >= 90 ? '#52c41a' : value >= 75 ? '#faad14' : '#ff4d4f';

  return (
    <div className="tv_ponct_container">
      {/** Départ */}
      <div className="tv_card kpi_card departure">
        <h3>Nombre de Départs</h3>
        <div className="tv_card_body">
          <span className="tv_value">{data.depart}</span>
          <Progress
            percent={data.depart}
            strokeColor={getStrokeColor(data.depart)}
            trailColor="#e6e6e6"
            strokeWidth={16}
            showInfo={false}
          />
          {renderTrend(data.departTrend)}
        </div>
      </div>

      {/** Attente */}
      <div className="tv_card kpi_card attente">
        <h3>Véhicules en attente</h3>
        <div className="tv_card_body">
          <span className="tv_value">{data.attente}</span>
          <Progress
            percent={data.attente}
            strokeColor={getStrokeColor(data.attente)}
            trailColor="#e6e6e6"
            strokeWidth={16}
            showInfo={false}
          />
          {renderTrend(data.attenteTrend)}
        </div>
      </div>

      {/** Disponible */}
      <div className="tv_card kpi_card dispo">
        <h3>Véhicules disponibles</h3>
        <div className="tv_card_body">
          <span className="tv_value">{data.dispo}</span>
          <Progress
            percent={data.dispo}
            strokeColor={getStrokeColor(data.dispo)}
            trailColor="#e6e6e6"
            strokeWidth={16}
            showInfo={false}
          />
          {renderTrend(data.dispoTrend)}
        </div>
      </div>
    </div>
  );
};

export default ModeTvCardPonct;
