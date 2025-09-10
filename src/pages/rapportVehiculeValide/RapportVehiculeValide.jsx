import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, AppstoreOutlined, TrademarkOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

// Texte avec tooltip
const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

// Date formatée dans un tag
const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

// Statut avec coloration dynamique et clignotement pour retards critiques
const renderStatutSortie = (statut, duree_retard) => {
  if (!statut) return <Tag>-</Tag>;

  let color = 'green'; 
  let isCritical = false;

  if (statut.includes('Retard') && duree_retard) {
    const [val, unit] = duree_retard.split(' ');
    const minutes = unit.startsWith('jour') ? parseFloat(val) * 1440
                  : unit.startsWith('heure') ? parseFloat(val) * 60
                  : parseFloat(val);

    if (minutes <= 30) color = 'orange';
    else if (minutes <= 60) color = 'red';
    else color = 'volcano';

    if (unit.startsWith('jour') && parseFloat(val) >= 1) isCritical = true;
  }

  return (
    <Tooltip title={duree_retard || '-'}>
      <Tag
        color={color}
        style={{ fontWeight: 600 }}
        className={isCritical ? 'retard-critique' : ''}
      >
        {statut} {duree_retard ? `(${duree_retard})` : ''}
      </Tag>
    </Tooltip>
  );
};

const RapportVehiculeValide = ({ data }) => {
  const columns = [
  { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50 },

  {
    title: <Space><AppstoreOutlined style={{ color: '#1890ff' }} /><Text strong>Motif</Text></Space>,
    dataIndex: 'nom_motif_demande',
    key:'nom_motif_demande',
    render: (text) => renderTextWithTooltip(text),
    ellipsis: true,
  },
  {
    title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>,
    dataIndex: 'nom_service',
    key:'nom_service',
    render: (text) => renderTextWithTooltip(text),
    ellipsis: true,
  },
  {
    title: <Space><UserOutlined style={{ color:'orange' }} /><Text strong>Chauffeur</Text></Space>,
    key:'chauffeur',
    render: (_, record) => renderTextWithTooltip(`${record.prenom_chauffeur} ${record.nom}`),
    ellipsis: true,
  },
  {
    title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>,
    dataIndex: 'nom_destination',
    key:'nom_destination',
    render: (text) => renderTextWithTooltip(text),
    ellipsis: true,
  },
  {
    title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Véhicule</Text></Space>,
    dataIndex:'nom_cat',
    key:'nom_cat',
    render: (text) => renderTextWithTooltip(text),
    ellipsis: true,
  },
  {
    title: 'Immatriculation',
    dataIndex:'immatriculation',
    key:'immatriculation',
    align: 'center',
    render: (text) => <Tag color='magenta'>{text}</Tag>,
  },
  {
    title: 'Marque',
    dataIndex:'nom_marque',
    key: 'nom_marque',
    align: 'center',
    render: (text) => <Tag icon={<TrademarkOutlined />} color="blue">{text}</Tag>,
  },
  {
    title: 'Sortie prévue',
    dataIndex:'date_prevue',
    key: 'date_prevue',
    align: 'center',
    render: (text) => renderDateTag(text),
  },
  {
    title: 'Retour prévu',
    dataIndex:'date_retour',
    key:'date_retour',
    align: 'center',
    render: (text) => renderDateTag(text),
  },
  {
    title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut</Text></Space>,
    key: 'statut_sortie',
    render: (_, record) => renderStatutSortie(record.statut_sortie, record.duree_retard),
  },
];


  return (
    <div className="rapportVehiculeValide">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => `${record.immatriculation}-${index}`} // clé unique
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default RapportVehiculeValide;
