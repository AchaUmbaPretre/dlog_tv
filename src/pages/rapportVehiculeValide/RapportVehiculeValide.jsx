import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography, Divider, Card } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, AppstoreOutlined, TrademarkOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

// Texte avec tooltip
const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text || '-'}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text || '-'}</Text>
    </div>
  </Tooltip>
);

// Date formatée dans un tag
const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

// Statut avec coloration dynamique et clignotement
const renderStatutSortie = (statut, duree_retard) => {
  if (!statut) return <Tag>-</Tag>;

  let color = 'green'; 
  let blinkClass = false;

  if (statut.includes('Retard') && duree_retard) {
    const [val, unit] = duree_retard.split(' ');
    const minutes = unit.startsWith('jour') ? parseFloat(val) * 1440
                  : unit.startsWith('heure') ? parseFloat(val) * 60
                  : parseFloat(val);

    if (minutes <= 30) color = 'orange';
    else if (minutes <= 60) color = 'red';
    else color = 'volcano';

    if (unit.startsWith('jour') && parseFloat(val) >= 1) blinkClass = true;
  }

  return (
    <Tooltip title={duree_retard || '-'}>
      <Tag
        color={color}
        style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px', fontSize: '0.9rem' }}
        className={blinkClass ? 'retard-critique' : ''}
      >
        {statut} {duree_retard ? `(${duree_retard})` : ''}
      </Tag>
    </Tooltip>
  );
};

const RapportVehiculeValide = ({ data }) => {
  const columns = [
    { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50, align: 'center' },

    { 
      title: <Space><AppstoreOutlined style={{ color: '#1890ff' }} /><Text strong>Motif</Text></Space>,
      key: 'nom_motif_demande',
      render: (_, record) => renderTextWithTooltip(record.nom_motif_demande),
    },
    { 
      title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>,
      key: 'nom_service',
      render: (_, record) => renderTextWithTooltip(record.nom_service),
    },
    { 
      title: <Space><UserOutlined style={{ color:'orange' }} /><Text strong>Chauffeur</Text></Space>,
      key: 'chauffeur',
      render: (_, record) => renderTextWithTooltip(`${record.prenom_chauffeur || '-'} ${record.nom || '-'}`),
    },
    { 
      title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>,
      key: 'nom_destination',
      render: (_, record) => renderTextWithTooltip(record.nom_destination),
    },
    { 
      title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Véhicule</Text></Space>,
      key: 'nom_cat',
      render: (_, record) => renderTextWithTooltip(record.nom_cat),
    },
    { 
      title: 'Immatriculation',
      key: 'immatriculation',
      align: 'center',
      render: (_, record) => <Tag color='magenta'>{record.immatriculation || '-'}</Tag>
    },
    { 
      title: 'Marque',
      key: 'nom_marque',
      align: 'center',
      render: (_, record) => <Tag icon={<TrademarkOutlined />} color="blue">{record.nom_marque || '-'}</Tag>
    },
    { 
      title: 'Sortie prévue',
      key: 'date_prevue',
      align: 'center',
      render: (_, record) => renderDateTag(record.date_prevue)
    },
    { 
      title: 'Retour prévu',
      key: 'date_retour',
      align: 'center',
      render: (_, record) => renderDateTag(record.date_retour)
    },
    { 
      title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut</Text></Space>,
      key: 'statut_sortie',
      render: (_, record) => renderStatutSortie(record.statut_sortie, record.duree_retard)
    }
  ];

  return (
    <div className="rapportVehiculeValide">
      <Card
        title={<Text strong style={{ fontSize: '1.2rem' }}>Véhicule en attente de sortie</Text>}
        bordered={false}
        style={{ borderRadius: 12 }}
      >
        <Divider />
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => `${record.immatriculation}-${index}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeValide;
