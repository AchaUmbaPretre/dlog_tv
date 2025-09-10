import { useEffect, useState } from 'react'
import { Input, Button, message, Menu, Dropdown, Tooltip, Typography, Tag, Table, Space, notification } from 'antd';
import moment from 'moment';
import { getSortieEntree } from '../../../../services/charroiService';
import {  SwapOutlined, MenuOutlined, DownOutlined, TrademarkOutlined, CheckCircleOutlined, ExclamationCircleOutlined, UndoOutlined, ExportOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const SortieEntree = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [columnsVisibility, setColumnsVisibility] = useState({
      "#" : true,
      "Chauffeur" : true,
      "Véhicule" : false,
      "Matricule" : true,
      "Marque" : true,
      "Type" : true,
      "Mouvement" : true,
      "Date & Heure" : true,
      "Destination" : true,
      "Client" : false,
      "Demandeur" : false,
      "Securité" : true
    });

    const menus = (
      <Menu>
        {Object.keys(columnsVisibility).map(columnName => (
          <Menu.Item key={columnName}>
            <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
              <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
              <span style={{ marginLeft: 8 }}>{columnName}</span>
            </span>
          </Menu.Item>
        ))}
      </Menu>
    ); 
    
    const toggleColumnVisibility = (columnName, e) => {
      e.stopPropagation();
      setColumnsVisibility(prev => ({
        ...prev,
        [columnName]: !prev[columnName]
      }));
    };

    const fetchData = async() => {
        try {
            const { data } = await  getSortieEntree()
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

    const handleExportExcel = () => {
      message.success('Exporting to Excel...');
    };
    
    const handleExportPDF = () => {
      message.success('Exporting to PDF...');
    };

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
                  width: "3%",
              ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),

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
                    <Text  type="secondary">{text}</Text>
                  </Tooltip>
                ),
                ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' })
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
                ...(columnsVisibility['Véhicule'] ? {} : { className: 'hidden-column' })
              },
              {
                title: (
                  <Space>
                    <Text strong>Matricule</Text>
                  </Space>
                ),
                dataIndex:'immatriculation',
                key: 'immatriculation',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => (
                  <Tooltip placement="topLeft" title={text}>
                    <Text  type="secondary">{text}</Text>
                  </Tooltip>
                ),
                ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' }),
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
                ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),
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
                },
                ...(columnsVisibility['Type'] ? {} : { className: 'hidden-column' }),

              },
             {
                title: "Sortie",
                dataIndex: 'mouvement_exceptionnel',
                key: 'mouvement_exceptionnel',
                align: 'center',
                render: (text) => {
                  const isExceptional = text !== 0;

                  const color = isExceptional ? 'volcano' : 'green';
                  const label = isExceptional ? 'Exceptionnelle' : 'Ordinaire';
                  const icon = isExceptional ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />;

                  return (
                    <Tag icon={icon} color={color} style={{ fontWeight: 'bold' }}>
                      {label}
                    </Tag>
                  );
                },
                ...(columnsVisibility['Mouvement'] ? {} : { className: 'hidden-column' }),
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
                  const date = moment.utc(text);
                  const isValid = date.isValid();              
                      return (
                          <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                              {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                          </Tag>
                      );
                  },
                ...(columnsVisibility['Date & Heure'] ? {} : { className: 'hidden-column' }),
              },
              {
                title : "Destination",
                dataIndex: 'nom_destination',
                key:'nom_destination',
                  render : (text) => (
                    <Tag color={'geekblue'}>{text}</Tag>
                  ),
                ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' }),
              },
              {
                title : "Demandeur",
                dataIndex: 'nom_service',
                key:'nom_service',
                  render : (text) => (
                    <Tag color={'geekblue'}>{text}</Tag>
                  ),
                ...(columnsVisibility['Demandeur'] ? {} : { className: 'hidden-column' }),
              },
              {
                title : "Client",
                dataIndex: 'nom_client',
                key:'nom_client',
                  render : (text) => (
                    <Tag color={'geekblue'}>{text}</Tag>
                  ),
                ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
              },
              {
                title: (
                  <Space>
                    <Text strong>Securité</Text>
                  </Space>
                ),
                dataIndex: 'nom',
                key: 'nom',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => (
                  <Tooltip placement="topLeft" title={text}>
                    <Text  type="secondary">{text}</Text>
                  </Tooltip>
                ),
                ...(columnsVisibility['Securité'] ? {} : { className: 'hidden-column' }),
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
  
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const filteredData = data.filter(item =>
    item.nom_chauffeur?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.type?.toLowerCase().includes(searchValue.toLocaleLowerCase())
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
                <Dropdown overlay={menus} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    Colonnes <DownOutlined />
                  </Button>
                </Dropdown>

                <Dropdown overlay={menu} trigger={['click']}>
                  <Button icon={<ExportOutlined />}>Export</Button>
                </Dropdown>
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

export default SortieEntree