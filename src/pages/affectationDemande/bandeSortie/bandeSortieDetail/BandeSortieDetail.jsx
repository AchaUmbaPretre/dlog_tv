import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Typography, Row, Col, Image } from 'antd';
import moment from 'moment';
import { getVehiculeCourseOne } from '../../../../../services/charroiService';
import config from '../../../../../config';

const { Title } = Typography;

const BandeSortieDetail = ({ id_bon }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDatas = async () => {
    setIsLoading(true);
    try {
      const response = await getVehiculeCourseOne(id_bon);
      setData(response.data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [id_bon]);

  if (isLoading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col span={12}>
          <Title level={5} style={{color: 'rgb(2, 2, 58)'}}>{data.nom_societe}</Title>
          <p><strong>RCCM:</strong> {data.rccm}</p>
          <p><strong>NIF:</strong> {data.nif}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Téléphone:</strong> {data.telephone}</p>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Image
            width={100}
            src={`${DOMAIN}/${data.logo}`}
            alt="Logo"
            preview={false}
            style={{ borderRadius: 8 }}
          />
        </Col>
      </Row>

      <Descriptions
        title="Détails du Bon de Sortie"
        bordered
        column={1}
        size="middle"
        style={{ marginTop: 32 }}
      >
        <Descriptions.Item label="Nom">
          {data.nom}
        </Descriptions.Item>
        <Descriptions.Item label="Service">
          {data.nom_service}
        </Descriptions.Item>
        <Descriptions.Item label="Rôle">
          {data.role}
        </Descriptions.Item>
        <Descriptions.Item label="Motif de la demande">
          {data.nom_motif_demande}
        </Descriptions.Item>
        <Descriptions.Item label="Date prévue">
          {moment(data.date_prevue).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Date retour">
          {moment(data.date_retour).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Adresse">
          {data.adresse}
        </Descriptions.Item>
        <Descriptions.Item label="Destination">
          {data.nom_destination}
        </Descriptions.Item>
        <Descriptions.Item label="Immatriculation">
          {data.immatriculation} ({data.nom_marque})
        </Descriptions.Item>
        <Descriptions.Item label="Type véhicule">
          {data.nom_type_vehicule}
        </Descriptions.Item>
        <Descriptions.Item label="Nombre de personnes à bord">
          {data.personne_bord}
        </Descriptions.Item>
        <Descriptions.Item label="Commentaire">
          {data.commentaire || 'Aucun'}
        </Descriptions.Item>
        <Descriptions.Item label="Statut">
          {data.nom_type_statut}
        </Descriptions.Item>
      </Descriptions>

      <Row justify="space-between" align="middle" style={{ marginTop: 32 }}>
        <Col>
          <p><strong>Signé par:</strong> {data.personne_signe}</p>
        </Col>
        <Col>
          <Image
            width={120}
            src={`${DOMAIN}/${data.signature}`}
            alt="Signature"
            preview={false}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default BandeSortieDetail;
