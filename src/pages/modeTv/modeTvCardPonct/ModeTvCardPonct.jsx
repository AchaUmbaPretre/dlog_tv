import { useState, useEffect } from "react";
import { Progress } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "./modeTvCardPonct.scss";

const TrendArrow = ({ previous, current }) => {
  if (previous === null) {
    return current > 0 ? (
      <ArrowUpOutlined style={{ color: "#52c41a" }} />
    ) : <MinusOutlined style={{ color: "#aaa" }} />;
  }
  if (current > previous)
    return <ArrowUpOutlined style={{ color: "#52c41a" }} />;
  if (current < previous)
    return <ArrowDownOutlined style={{ color: "#ff4d4f" }} />;
  return <MinusOutlined style={{ color: "#aaa" }} />;
};

const ModeTvCardPonct = ({ datas }) => {
  const [prevData, setPrevData] = useState({
    depart: null,
    attente: null,
    dispo: null,
  });
  const [data, setData] = useState({
    depart: 0,
    attente: 0,
    dispo: 0,
    departPrecedent: 0,
    attentePrecedent: 0,
  });
  const [flash, setFlash] = useState({
    depart: "",
    attente: "",
    dispo: "",
  });

  useEffect(() => {
    if (!datas) return;

    const newData = {
      depart: Number(datas.depart_actuel || 0),
      attente: Number(datas.attente_actuel || 0),
      dispo: Number(datas.vehicule_dispo || 0),
      departPrecedent: Number(datas.depart_precedent || 0),
      attentePrecedent: Number(datas.attente_precedent || 0),
    };

    const newFlash = {
      depart: newData.depart !== data.depart ? "flash" : "",
      attente: newData.attente !== data.attente ? "flash" : "",
      dispo: newData.dispo !== data.dispo ? "flash" : "",
    };

    setFlash(newFlash);
    setPrevData(data);
    setData(newData);

    const timer = setTimeout(
      () => setFlash({ depart: "", attente: "", dispo: "" }),
      500
    );
    return () => clearTimeout(timer);
  }, [datas]);

  const getStrokeColor = (value) =>
    value >= 90 ? "#52c41a" : value >= 75 ? "#faad14" : "#ff4d4f";

  const renderCard = (title, key, previousKey = null) => (
    <div className={`tv_card kpi_card ${key}`}>
      <h3>{title}</h3>
      <div className="tv_card_body">
        <div className="tv_value_wrapper">
          <span className="tv_value">{data[key]}</span>
          <TrendArrow previous={data[previousKey]} current={data[key]} />
        </div>

        {previousKey && (
          <span className="tv_previous">Hier : {data[previousKey]}</span>
        )}

        <Progress
          percent={data[key]}
          strokeColor={getStrokeColor(data[key])}
          trailColor="#333"
          strokeWidth={16}
          showInfo={false}
        />
      </div>
    </div>
  );

  return (
    <div className="tv_ponct_container">
      {renderCard("Nombre de Départs", "depart", "departPrecedent")}
      {renderCard("Véhicules en attente", "attente", "attentePrecedent")}
      {renderCard("Véhicules disponibles", "dispo")}
    </div>
  );
};

export default ModeTvCardPonct;
