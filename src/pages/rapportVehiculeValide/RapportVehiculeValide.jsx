import './rapportVehiculeValide.scss';
import { Table, Space, Typography, Divider, Card, Badge } from 'antd';
import { CarOutlined, AppstoreOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ChronoBox, MoyenneBox, TooltipBox } from '../../utils/RenderTooltip';

const { Text } = Typography;

const RapportVehiculeValide = ({ data }) => {
  const columns = [
    { 
      title: '#', 
      key: 'index', 
      render: (_, __, index) => <Text style={{ color:'#fff', fontWeight:900, fontSize:28 }}>{index + 1}</Text>, 
      width: 70, 
      align: 'center' 
    },
    { 
      title: <Space><AppstoreOutlined style={{ color: '#1d39c4', fontSize: 28 }} /><Text strong style={{ fontSize:32, color:'#fff' }}>Motif</Text></Space>, 
      key: 'nom_service', 
      render: (_, record) => <TooltipBox text={record.nom_service} bg="#333" />
    },
    { 
      title: <Space><UserOutlined style={{ color:'orange', fontSize: 28 }} /><Text strong style={{ fontSize:32, color:'#fff' }}>Chauffeur</Text></Space>, 
      key: 'chauffeur', 
      render: (_, record) => <TooltipBox text={`${record.prenom_chauffeur || '-'} ${record.nom || '-'}`} bg="#333" />
    },
    { 
      title: <Space><EnvironmentOutlined style={{ color: 'red', fontSize: 28 }} /><Text strong style={{ fontSize:32, color:'#fff' }}>Destination</Text></Space>, 
      key: 'nom_destination', 
      render: (_, record) => <TooltipBox text={record.nom_destination} bg="#333" />
    },
    { 
      title: <Space><CarOutlined style={{ color: 'green', fontSize: 28 }} /><Text strong style={{ fontSize:32, color:'#fff' }}>Véhicule</Text></Space>, 
      key: 'nom_cat', 
      render: (_, record) => <TooltipBox text={record.nom_cat} bg="#333" />
    },
    { 
      title: 'Sortie prévue', 
      key: 'date_prevue', 
      align: 'center', 
      render: (_, record) => <TooltipBox text={moment(record.date_prevue).format('DD-MM-YYYY HH:mm')} bg="#1890ff" />
    },
    { 
      title: "Durée Moyenne", 
      key: "duree_moyenne_min", 
      align: 'center', 
      render: (_, record) => <MoyenneBox duree_moyenne_min={record.duree_moyenne_min} />
    },
    { 
      title: "Chrono", 
      key: "chrono", 
      align: 'center', 
      render: (_, record) => <ChronoBox sortie_time={record.date_prevue} />
    }
  ];

  const nbVehiculesAttente = data.length;

  return (
    <div className="rapportVehiculeValideTV">
      <Card
        title={
          <Space direction="horizontal" size={28} align="center">
            <Text strong style={{ fontSize: 40, color: '#fff', fontWeight: 'bold' }}>Véhicules en attente de sortie</Text>
            <Badge
              count={nbVehiculesAttente}
              style={{ backgroundColor: '#faad14', fontSize: '1.5rem', minWidth: 44, height: 44 }}
            />
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 6px 30px rgba(0,0,0,0.15)', backgroundColor:'#1a1a1a' }}
      >
        <Divider style={{ margin: '14px 0', borderColor:'#444' }} />
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => `${record.immatriculation}-${index}`}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered={false}
          size="middle"
          rowClassName={(record) => record.nom_statut_bs === 'Retard' ? 'row-retard' : ''}
        />
      </Card>
    </div>
  );
};

export default RapportVehiculeValide;
