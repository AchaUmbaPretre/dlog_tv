import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Typography, Space, Card, Divider, Progress, Badge } from 'antd';
import { TruckOutlined, FullscreenOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Tooltip pro
const TooltipBox = (text, bg = '#1a1a1a', color = '#fff', maxWidth = 200) => (
  <Tooltip title={text || '-'}>
    <div
      style={{
        maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor: bg,
        color,
        fontWeight: 700,
        fontSize: 22,
        borderRadius: 10,
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

// Score dynamique
const ScoreBox = (value) => {
  if (value == null) return TooltipBox('Aucun', '#d9d9d9', '#000');

  let color = '#1890ff';
  if (value < 40) color = '#ff4d4f';
  else if (value < 70) color = '#faad14';
  else if (value < 90) color = '#52c41a';

  return (
    <Tooltip title={`Score: ${value}%`}>
      <div style={{ display: 'flex', justifyContent: 'center', background: '#222', borderRadius: 50, padding: 4 }}>
        <Progress
          type="circle"
          percent={value}
          width={60}
          strokeColor={color}
          trailColor="#555"
          format={(p) => <span style={{ color: '#fff', fontWeight: 900 }}>{p}%</span>}
        />
      </div>
    </Tooltip>
  );
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
        <Space className="column-title">
          <TruckOutlined style={{ color: '#52c41a', fontSize: 28 }} />
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
          <Text strong style={{ fontSize: 28, color: '#fff' }}>
            Véhicules Utilitaires
            <Badge count={utilitaire.length} style={{ backgroundColor: '#52c41a', fontSize: 20, marginLeft: 12 }} />
          </Text>
        }
        extra={<FullscreenOutlined style={{ fontSize: 26, cursor: 'pointer', color: '#fff' }} />}
        bordered={false}
        style={{
          borderRadius: 16,
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        <Divider style={{ margin: '16px 0', borderColor: '#444' }} />
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
