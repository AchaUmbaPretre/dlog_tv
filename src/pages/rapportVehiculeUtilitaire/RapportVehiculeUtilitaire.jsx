import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Typography, Space, Card, Divider, Progress, Badge } from 'antd';
import { TruckOutlined, CarOutlined, FullscreenOutlined } from '@ant-design/icons';
import { ScoreBox } from '../../utils/RenderTooltip';

const { Text } = Typography;

// Tooltip pro
const TooltipBox = (text, bg = '#1a1a1a', color = '#fff', maxWidth = 300) => (
  <Tooltip title={text || '-'}>
    <div
      style={{
        maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor: bg,
        color,
        fontWeight: 800,
        fontSize: 50,
        borderRadius: 12,
        padding: '6px 12px',
        textAlign: 'center',
      }}
    >
      {text || '-'}
    </div>
  </Tooltip>
);

// Statut dynamique
const StatutBox = (statut) => {
  let bgColor = '#595959';
  if (statut.includes('Disponible')) bgColor = '#52c41a';
  else if (statut.includes('Retard')) bgColor = '#faad14';
  else if (statut.includes('Critique')) bgColor = '#ff4d4f';

  return TooltipBox(statut, bgColor, '#fff');
};


const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    {
      title: <span className="column-title">#</span>,
      key: 'index',
      render: (_, __, index) => TooltipBox(index + 1, '#1890ff'),
      width: '5%',
      align: 'center',
    },
    {
      title: (
        <Space className="column-title" align="center">
          <TruckOutlined style={{ color: '#52c41a', fontSize: 40 }} />
          Matricule
        </Space>
      ),
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      render: (text) => TooltipBox(text),
      width: '20%',
    },
    {
      title: <span className="column-title">Marque</span>,
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => TooltipBox(text),
      width: '20%',
    },
    {
      title: <span className="column-title">Type véhicule</span>,
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      render: (text) => TooltipBox(text ?? 'Aucun'),
      width: '25%',
    },
    {
      title: <span className="column-title">Statut</span>,
      dataIndex: 'statut_affichage',
      key: 'statut_affichage',
      render: (text) => StatutBox(text),
      width: '20%',
    },
    {
      title: <span className="column-title">Score</span>,
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      render: (value) => ScoreBox(value),
      width: '15%',
    },
  ];

  return (
    <div className="rapportVehiculeUtilitaireTV">
      <Card
        title={
          <Space direction="horizontal" size={28} align="center">
            <CarOutlined style={{ color: "#1890ff", fontSize: 45 }} />
            <Text strong style={{ fontSize: 50, color: '#fff', fontWeight: 'bold' }}>
              Véhicules utilitaires
            </Text>
            <Badge
              count={utilitaire.length}
              style={{ backgroundColor: '#52c41a', fontSize: 40, minWidth: 44, height: 44, display:'flex', alignItems:'center', justifyContent:'center' }}
            />
          </Space>
        }
        extra={<FullscreenOutlined style={{ fontSize: 26, cursor: 'pointer', color: '#fff' }} />}
        bordered={false}
        style={{
          borderRadius: 16,
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        <Table
          columns={columns}
          dataSource={utilitaire}
          rowKey={(record, index) => index}
          pagination={false}
          bordered={false}
          size="middle"
          scroll={{ x: 'max-content' }}
          rowClassName={(record) =>
            record.statut_affichage.includes('Critique') ? 'row-critical' : ''
          }
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeUtilitaire;
