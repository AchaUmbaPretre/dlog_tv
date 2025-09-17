import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Typography, Card, Divider, Progress } from 'antd';
import { CarOutlined, TruckOutlined } from '@ant-design/icons';
import { formatDuration } from '../../utils/RenderTooltip';

const { Text } = Typography;

// Composant Tooltip pro
const TooltipBox = (text, bg = 'transparent', color = '#fff', maxWidth = 180) => (
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
        fontSize: 20,
        borderRadius: 10,
        padding: '4px 10px',
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

  return TooltipBox(statut, bgColor);
};

// Score dynamique
const ScoreBox = (value) => {
  if (value == null) return TooltipBox('Aucun', '#d9d9d9', '#fff');

  let color = '#1890ff';
  if (value < 40) color = '#ff4d4f';
  else if (value < 70) color = '#faad14';
  else if (value < 90) color = '#52c41a';

  return (
    <Tooltip title={`Score: ${value}%`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Progress
          type="circle"
          percent={value}
          width={50}
          strokeColor={color}
          format={(percent) => `${percent}%`}
        />
      </div>
    </Tooltip>
  );
};

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => TooltipBox(index + 1, '#1890ff'),
      width: '5%',
      align: 'center',
    },
    {
      title: 'Matricule',
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      render: (text) => TooltipBox(text, '#1a1a1a'),
      width: '20%',
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => TooltipBox(text, '#1a1a1a'),
      width: '20%',
    },
    {
      title: 'Type véhicule',
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      render: (text) => TooltipBox(text ?? 'Aucun', '#1a1a1a'),
      width: '25%',
    },
    {
      title: 'Statut',
      dataIndex: 'statut_affichage',
      key: 'statut_affichage',
      render: (text) => StatutBox(text),
      width: '20%',
    },
    {
      title: 'Score',
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
          <Text strong style={{ fontSize: '1.2rem', color: '#fff' }}>
            Liste des véhicules utilitaires
            <span style={{ marginLeft: 12 }}>{utilitaire.length}</span>
          </Text>
        }
        bordered={false}
        style={{
          borderRadius: 12,
          backgroundColor: '#1a1a1a',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
        }}
      >
        <Divider style={{ borderColor: '#444' }} />
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
      <style jsx>{`
        .row-critical {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default RapportVehiculeUtilitaire;
