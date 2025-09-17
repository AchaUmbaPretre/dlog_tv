import { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './modeTvCardPonct.scss';

const TrendArrow = ({ previous, current }) => {
  if (previous === null) {
    // Premier rendu, on montre la flèche si valeur > 0
    return current > 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : null;
  }
  if (current > previous) return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
  if (current < previous) return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
  return null; // stable
};

const ModeTvCardPonct = ({ datas }) => {
  const [prevData, setPrevData] = useState({ depart: null, attente: null, dispo: null });
  const [data, setData] = useState({ depart: 0, attente: 0, dispo: 0 });
  const [flash, setFlash] = useState({ depart: '', attente: '', dispo: '' });


  useEffect(() => {
    if (!datas) return;

    const newData = {
      depart: Number(datas.depart_actuel || 0),
      attente: Number(datas.attente_actuel || 0),
      dispo: Number(datas.vehicule_dispo || 0),
    };

    // Détecter changement pour animation flash
    const newFlash = {
      depart: newData.depart !== data.depart ? 'flash' : '',
      attente: newData.attente !== data.attente ? 'flash' : '',
      dispo: newData.dispo !== data.dispo ? 'flash' : '',
    };

    setFlash(newFlash);
    setPrevData(data);
    setData(newData);

    // Reset flash après 500ms
    const timer = setTimeout(() => setFlash({ depart: '', attente: '', dispo: '' }), 500);
    return () => clearTimeout(timer);

  }, [datas]);

  const getStrokeColor = (value) =>
    value >= 90 ? '#52c41a' : value >= 75 ? '#faad14' : '#ff4d4f';

  const renderCard = (title, key) => (
    <div className={`tv_card kpi_card ${key}`}>
      <h3>{title}</h3>
      <div className="tv_card_body">
        <span className="tv_value">{data[key]}</span>
        <Progress
          percent={data[key]}
          strokeColor={getStrokeColor(data[key])}
          trailColor="#e6e6e6"
          strokeWidth={16}
          showInfo={false}
        />
        <div className={`tv_trend ${flash[key]}`}>
          <TrendArrow previous={prevData[key]} current={data[key]} />
          <span>
            {prevData[key] === null
              ? 'Nouveau'
              : data[key] > prevData[key]
              ? 'En hausse'
              : data[key] < prevData[key]
              ? 'En baisse'
              : 'Stable'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tv_ponct_container">
      {renderCard('Nombre de Départs', 'depart')}
      {renderCard('Véhicules en attente', 'attente')}
      {renderCard('Véhicules disponibles', 'dispo')}
    </div>
  );
}

export default ModeTvCardPonct;
