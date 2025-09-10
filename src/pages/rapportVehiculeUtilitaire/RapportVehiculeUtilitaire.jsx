import { Table, Tooltip, Space, Typography, Tag } from 'antd';
import { CarOutlined, EnvironmentOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Rend un texte avec tooltip pour les colonnes longues
 */
const renderTextWithTooltip = (text, color = 'secondary') => (
  <Tooltip title={text}>
    <div>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

/**
 * Rend la durée de retard sous forme de tag coloré
 * Supporte les minutes, heures et jours
 */
const renderRetardTag = (duree_retard) => {
  if (!duree_retard) return <Tag>-</Tag>;

  let color = 'green';
  const [val, unit] = duree_retard.split(' ');
  const value = parseFloat(val);

  // Définition des seuils selon l'unité
  switch (unit) {
    case 'minute(s)':
      if (value > 60) color = 'orange';
      if (value > 1440) color = 'volcano';
      break;
    case 'heure(s)':
      if (value > 12) color = 'orange';
      if (value > 24) color = 'volcano';
      break;
    case 'jour(s)':
      if (value > 1) color = 'red';
      if (value > 2) color = 'volcano';
      break;
    default:
      color = 'green';
  }

  return <Tag color={color}>{duree_retard}</Tag>;
};

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    { 
      title: '#', 
      key: 'index', 
      render: (_, __, index) => index + 1, 
      width: 50 
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'green' }} />
          <Text strong>Type de véhicule</Text>
        </Space>
      ),
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      render: renderTextWithTooltip,
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: 'red' }} />
          <Text strong>Destination</Text>
        </Space>
      ),
      dataIndex: 'nom_destination',
      key: 'nom_destination',
      render: renderTextWithTooltip,
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: 'orange' }} />
          <Text strong>Durée Retard</Text>
        </Space>
      ),
      dataIndex: 'duree_retard',
      key: 'duree_retard',
      render: renderRetardTag,
    }
  ];

  return (
    <div className="rapportVehiculeValide">
      <div className="rapport_title">
        <h2 className="rapport_h2">Utilitaires</h2>
      </div>
      <Table
        columns={columns}
        dataSource={utilitaire}
        rowKey={(record, index) => index}
        pagination={false}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeUtilitaire;
