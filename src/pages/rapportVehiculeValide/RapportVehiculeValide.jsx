import './rapportVehiculeValide.scss';
import { Table, Tag, Tooltip, Space, Typography, Divider, Card, Badge } from 'antd';
import { 
  CarOutlined, ApartmentOutlined, UserOutlined, FieldTimeOutlined, 
  EnvironmentOutlined, AppstoreOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { MoyenneTag, renderStatutHoraire } from '../../utils/RenderTooltip';

const { Text } = Typography;

const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text || '-'}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text || '-'}</Text>
    </div>
  </Tooltip>
);

const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

const RapportVehiculeValide = ({ data }) => {
  const columns = [
    { title: '#', key: 'index', render: (_, __, index) => index + 1, width: 50, align: 'center' },
    { title: <Space><AppstoreOutlined style={{ color: '#1890ff' }} /><Text strong>Motif</Text></Space>, key: 'nom_motif_demande', render: (_, record) => renderTextWithTooltip(record.nom_motif_demande) },
    { title: <Space><ApartmentOutlined style={{ color: '#1d39c4' }} /><Text strong>Service</Text></Space>, key: 'nom_service', render: (_, record) => renderTextWithTooltip(record.nom_service) },
    { title: <Space><UserOutlined style={{ color:'orange' }} /><Text strong>Chauffeur</Text></Space>, key: 'chauffeur', render: (_, record) => renderTextWithTooltip(`${record.prenom_chauffeur || '-'} ${record.nom || '-'}`) },
    { title: <Space><EnvironmentOutlined style={{ color: 'red' }} /><Text strong>Destination</Text></Space>, key: 'nom_destination', render: (_, record) => renderTextWithTooltip(record.nom_destination) },
    { title: <Space><CarOutlined style={{ color: 'green' }} /><Text strong>Véhicule</Text></Space>, key: 'nom_cat', render: (_, record) => renderTextWithTooltip(record.nom_cat) },
    { title: 'Sortie prévue', key: 'date_prevue', align: 'center', render: (_, record) => renderDateTag(record.date_prevue) },
    { title: <Space><FieldTimeOutlined style={{ color:'orange' }} /><Text strong>Statut</Text></Space>, key: 'statut_horaire', render: (_, record) => renderStatutHoraire(record.nom_statut_bs, record.date_prevue) },
    { title: "Durée Moyenne", key: "duree_moyenne_min", align: 'center', render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} /> },
  ];

  // Calcul nombre de véhicules en attente
  const nbVehiculesAttente = data.length;

  return (
    <div className="rapportVehiculeValide">
      <Card
        title={
          <Space direction="horizontal" size={20} align="center">
            <Text strong style={{ fontSize: '1.2rem' }}>Véhicules en attente de sortie</Text>
            <Badge
              count={nbVehiculesAttente}
              style={{ backgroundColor: '#faad14', fontSize: '0.9rem', minWidth: 25, height: 25 }}
            />
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <Divider style={{ margin: '10px 0' }} />
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => `${record.immatriculation}-${index}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
          size="middle"
          rowClassName={(record) => record.nom_statut_bs === 'Retard' ? 'row-retard' : ''}
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeValide;
