import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Typography, Tag, Card, Divider, Progress } from 'antd';
import { CarOutlined, TruckOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "5%",
      align: "center",
    },
    {
      title: 'Matricule',
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      render: (text) => (
        <div className="vehicule-matricule">
          <span className="car-wrapper">
            <span className="car-boost" />
            <CarOutlined className="car-icon-animated" />
            <span className="car-shadow" />
          </span>
          <Tag color="geekblue" style={{ fontWeight: 600 }}>{text}</Tag>
        </div>
      ),
      width: "20%",
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => (
        <Tag icon={<CarOutlined />} color="cyan" style={{ fontWeight: 600 }}>
          {text}
        </Tag>
      ),
      width: "20%",
    },
    {
      title: 'Type véhicule',
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      render: (text) => (
        <Tag icon={<TruckOutlined />} color="geekblue" style={{ fontWeight: 600 }}>
          {text ?? 'Aucun'}
        </Tag>
      ),
      width: "25%",
    },
    {
      title: 'Statut',
      dataIndex: 'statut_affichage',
      key: 'statut_affichage',
      render: (text) => {
        let color = text.includes('Disponible') ? 'green' : 'orange';
        return (
          <Tooltip title={`Statut du véhicule: ${text}`}>
            <Tag color={color} style={{ fontWeight: 600 }}>{text}</Tag>
          </Tooltip>
        );
      },
      width: "20%",
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      align: "center",
      render: (value) => {
        if (!value) return <Tag color="default">Aucun</Tag>;

        let color = 'blue';
        if (value < 40) color = 'red';
        else if (value < 70) color = 'orange';
        else if (value < 90) color = 'green';
        else color = 'geekblue';

        return (
          <Tooltip title={`Score: ${value}%`}>
            <Progress 
              percent={value} 
              size="small" 
              strokeColor={color} 
              showInfo={false} 
              style={{ width: 80 }} 
            />
          </Tooltip>
        );
      },
      width: "15%",
    },
  ];

  return (
    <div className="rapportVehiculeValide">
      <Card
        title={<Text strong style={{ fontSize: '1.2rem' }}>Utilitaires</Text>}
        bordered={false}
        style={{ borderRadius: 12 }}
      >
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
