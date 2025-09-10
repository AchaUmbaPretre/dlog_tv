import { useEffect, useState } from 'react'
import { Input, Button, Tooltip, Typography, Tag, Table, Space, notification } from 'antd';
import moment from 'moment';
import { getSortieEntree, getSortieVehiculeExceptionnel } from '../../../../services/charroiService';
import {  SwapOutlined, TrademarkOutlined, UndoOutlined, ExportOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const SortieExceptionnelle = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });

    const fetchData = async() => {
        try {
            const { data } = await getSortieVehiculeExceptionnel()
            setData(data)
        } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              escription: 'Une erreur est survenue lors du chargement des données.',
            });
                    
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, []);

       const handleReleve = () => {
    
        }

    const columns = [
      {
        title: '#',
        dataIndex: 'id',
        key: 'id',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
        },
        width: "3%"
    },
    {
    title: (
      <Space>
        <Text strong>Chauffeur</Text>
      </Space>
    ),
    dataIndex: 'nom_chauffeur',
    key: 'nom_chauffeur',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
    title: (
      <Space>
        <Text strong>Véhicule</Text>
      </Space>
    ),
    dataIndex:'nom_cat',
    key: 'nom_cat',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text  type="secondary">{text}</Text>
      </Tooltip>
    ),
    },
    {
    title: (
      <Space>
        <Text strong>Matricule</Text>
      </Space>
    ),
    dataIndex:'immatriculation',
    key: 'immatriculation',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text  type="secondary">{text}</Text>
      </Tooltip>
    ),
    },
    {
      title: (
        <Space>
          <Text strong>Marque</Text>
        </Space>
      ),
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      align: 'center',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Tag icon={<TrademarkOutlined />} color="blue">
            {text}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text) => {
        const isRetour = text === 'Retour';
        const icon = isRetour ? <UndoOutlined /> : <ExportOutlined />;
        const color = isRetour ? 'blue' : 'red';

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Date & Heure</Text>
        </Space>
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        if (!text) {
            return (
                <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                </Tag>
            );
        }
        const date = moment(text);
        const isValid = date.isValid();              
            return (
                <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                    {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                </Tag>
            );
        },
    },
    {
    title: (
      <Space>
        <Text strong>Autorisé par</Text>
      </Space>
    ),
    dataIndex: 'autorise_par',
    key: 'autorise_par',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
        title: (
        <Text strong>Actions</Text>
        ),
        key: 'action',
        align: 'center',
        render: (text, record) => (
        <Space size="small">

            <Tooltip title={`Relevé de ${record.type}`}>
                <Button
                    icon={<FileTextOutlined />}
                    style={{ color: 'blue' }}
                    onClick={() => handleReleve(record.id_bande_sortie)}
                    aria-label="Relevé"
                />
            </Tooltip>
        </Space>
        ),
    },
   ];

    const filteredData = data.filter(item =>
        item.nom_chauffeur?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.autorise_par?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.type?.toLowerCase().includes(searchValue.toLowerCase())

    );

  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <SwapOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2">Entrée / Sortie</h2>
            </div>
            <div className="client-actions">
              <div className="client-row-left">
                <Search 
                  placeholder="Recherche..." 
                  enterButton 
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="client-rows-right">
              </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="small"
                scroll={scroll}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
              />
            </div>
        </div>

    </>
  )
}

export default SortieExceptionnelle;