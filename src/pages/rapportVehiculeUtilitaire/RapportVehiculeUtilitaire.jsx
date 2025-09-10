import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Space, Typography, Tag, Card, Divider } from 'antd';
import { CarOutlined, EnvironmentOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Texte avec tooltip
const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 180) => (
  <Tooltip title={text || '-'}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color} style={{ fontSize: '0.95rem' }}>{text || '-'}</Text>
    </div>
  </Tooltip>
);

// Durée retard avec coloration et clignotement pour retard critique
const renderRetardTag = (duree_retard) => {
  if (!duree_retard) return <Tag>-</Tag>;

  const [val, unit] = duree_retard.split(' ');
  const value = parseFloat(val);
  let color = 'green';
  let blinkClass = false;

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
      if (value >= 1) blinkClass = true; // clignotement pour retard ≥ 1 jour
      break;
    default:
      color = 'green';
  }

  return (
    <Tag
      color={color}
      style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px', fontSize: '0.9rem' }}
      className={blinkClass ? 'retard-critique' : ''}
    >
      {duree_retard}
    </Tag>
  );
};

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50, align: 'center' },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'green' }} />
          <Text strong>Type de véhicule</Text>
        </Space>
      ),
      key: 'nom_cat',
      render: (_, record) => renderTextWithTooltip(record.nom_cat),
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: 'red' }} />
          <Text strong>Destination</Text>
        </Space>
      ),
      key: 'nom_destination',
      render: (_, record) => renderTextWithTooltip(record.nom_destination),
    },
    {
      title: (
        <Space>
          <FieldTimeOutlined style={{ color: 'orange' }} />
          <Text strong>Durée Retard</Text>
        </Space>
      ),
      key: 'duree_retard',
      render: (_, record) => renderRetardTag(record.duree_retard),
    }
  ];

  return (
    <div className="rapportVehiculeValide">
      <Card
        title={<Text strong style={{ fontSize: '1.2rem' }}>Utilitaires</Text>}
        bordered={false}
        style={{ borderRadius: 12 }}
      >
        {/* Légende */}
        <div className="legend" style={{ marginBottom: 10 }}>
          <Tag color="green">OK</Tag>
          <Tag color="orange">⚠️ Retard léger</Tag>
          <Tag color="red">⛔ Retard >1j</Tag>
          <Tag className="retard-critique" color="volcano">⚡ Critique</Tag>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={utilitaire}
          rowKey={(record, index) => index}
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeUtilitaire;
