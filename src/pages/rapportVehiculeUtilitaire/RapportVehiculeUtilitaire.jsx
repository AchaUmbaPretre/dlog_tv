import './rapportVehiculeUtilitaire.scss';
import { Table, Tooltip, Typography, Card, Divider, Progress, Badge } from 'antd';
import { CarOutlined, TruckOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RapportVehiculeUtilitaire = ({ utilitaire }) => {
  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Badge count={index + 1} style={{ backgroundColor: '#1890ff', fontSize: '0.9rem' }} />
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
          <Text strong>{text}</Text>
        </div>
      ),
      width: "20%",
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      render: (text) => <Text>{text}</Text>,
      width: "20%",
    },
    {
      title: 'Type véhicule',
      dataIndex: 'nom_cat',
      key: 'nom_cat',
      render: (text) => <Text>{text ?? 'Aucun'}</Text>,
      width: "25%",
    },
    {
      title: 'Statut',
      dataIndex: 'statut_affichage',
      key: 'statut_affichage',
      render: (text) => {
        let color = 'default';
        if (text.includes('Disponible')) color = '#52c41a';
        else if (text.includes('Retard')) color = '#faad14';
        else if (text.includes('Critique')) color = '#f5222d';

        return (
          <Tooltip title={`Statut du véhicule: ${text}`}>
            <Badge
              color={color}
              text={text}
              style={{ fontWeight: 600 }}
            />
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
        if (value == null)
          return (
            <Badge count="Aucun" style={{ backgroundColor: '#d9d9d9', fontSize: '0.8rem' }} />
          );

        let color = '#1890ff';
        if (value < 40) color = '#ff4d4f';
        else if (value < 70) color = '#faad14';
        else if (value < 90) color = '#52c41a';

        return (
          <Tooltip title={`Score: ${value}%`}>
            <Progress
              type="circle"
              percent={value}
              width={50}
              strokeColor={color}
              format={(percent) => `${percent}%`}
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
        title={<Text strong style={{ fontSize: '1.2rem' }}>Liste des véhicules utilitaires <Badge count={utilitaire.length} style={{ backgroundColor: '#1890ff', fontSize: '1rem' }} /></Text>}
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
