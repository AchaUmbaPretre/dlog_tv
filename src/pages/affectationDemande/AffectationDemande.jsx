import { useEffect, useState } from 'react'
import { Table, Modal, Menu, message, Dropdown, Tag, Space, Tooltip, Button, Typography, Input, notification } from 'antd';
import { CarOutlined, AppstoreOutlined, EnvironmentOutlined, DownOutlined, ExportOutlined, MenuOutlined, TrademarkOutlined, FormOutlined, CheckCircleOutlined, PlusCircleOutlined, UserOutlined, SwapOutlined, CalendarOutlined } from '@ant-design/icons';
import { getAffectationDemande } from '../../../services/charroiService';
import moment from 'moment';
import AffectationDemandeForm from './affectationDemandeForm/AffectationDemandeForm';
import { statusIcons } from '../../../utils/prioriteIcons';
import BandeSortieForm from './bandeSortie/bandeSortieForm/BandeSortieForm';

const { Search } = Input;
const { Text } = Typography;

const AffectationDemande = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [affectationId, setAffectationId] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
      "Service" : true,
      "Demandeur" : true,
      "Departement" : false,
      "Destination" : true,
      "Chauffeur" : true,
      "Véhicule" : true,
      "Immatriculation" : true,
      "Marque" : false,
      "Preuve" : true,
      "Retour" : false,
      "Statut" : true,
      "Commentaire" : false,
      "Crée par" : false,
    });

    const columnStyles = {
      title: {
        maxWidth: '150px',
        whiteSpace: 'nowrap',
        overflowX: 'scroll', 
        overflowY: 'hidden',
        textOverflow: 'ellipsis',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none', 
      },
      hideScroll: {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    };

    const handleAdd = () => openModal('Add')
    const handlSortie = (id) => openModal('Bande', id)

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, affectationId = '') => {
      closeAllModals();
      setModalType(type);
      setAffectationId(affectationId)
    };
        
    const fetchData = async() => {
      try {
        const { data } = await  getAffectationDemande()
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

    const handleExportExcel = () => {
        message.success('Exporting to Excel...');
    };

    const handleExportPDF = () => {
        message.success('Exporting to PDF...');
    };

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
        <AppstoreOutlined style={{ color: '#1890ff' }} />
        <Text strong>Service</Text>
      </Space>
        ),
        dataIndex: 'nom_motif_demande',
        key:'nom_motif_demande',
        ellipsis: {
          showTitle: false,
        },
          render : (text) => (
            <Tooltip placement="topLeft" title={text}>
              <Text type="secondary">{text}</Text>
            </Tooltip>
          ),
        ...(columnsVisibility['Service'] ? {} : { className: 'hidden-column' }),
    },
    {
        title : "Demandeur",
        dataIndex: 'nom_service',
        key:'nom_service',
        ellipsis: {
          showTitle: false,
        },
        render : (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text type="secondary">{text}</Text>
          </Tooltip>
        ),
      ...(columnsVisibility['Demandeur'] ? {} : { className: 'hidden-column' }),
    },
    {
      title : "DPT",
      dataIndex: 'nom_departement',
      key:'nom_departement',
        render : (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text type="secondary">{text}</Text>
          </Tooltip>
        ),
        ...(columnsVisibility['Departement'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <UserOutlined  style={{color:'orange'}}/>
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: 'nom',
      key: 'nom',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
      ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: 'red' }} />
          <Text strong>Destination</Text>
        </Space>
      ),
            dataIndex: 'nom_destination',
            key: 'nom_destination',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                  <Text  type="secondary">{text}</Text>
                </div>
              </Tooltip>
            ),
            ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'red' }} />
          <Text strong>Véhicule</Text>
        </Space>
      ),
      dataIndex:'nom_cat',
      key: 'nom_cat',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={columnStyles.title} className={columnStyles.hideScroll}>
            <Text  type="secondary">{text}</Text>
          </div>
        </Tooltip>
      ),
      ...(columnsVisibility['Véhicule'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'green' }} />
          <Text strong>Immatriculation</Text>
        </Space>
      ),
      dataIndex:'immatriculation',
      key: 'immatriculation',
      ellipsis: {
        showTitle: false,
      },
      align: 'center',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <div style={columnStyles.title} className={columnStyles.hideScroll}>
              <Tag color='magenta'>{text}</Tag>
            </div>
          </Tooltip>
        ),
        ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' })
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: '#2db7f5' }} />
          <Text strong>Marque</Text>
        </Space>
      ),
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      align: 'center',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Tag icon={<TrademarkOutlined />} color="blue">
            {text.toUpperCase()}
          </Tag>
        </Tooltip>
      ),
      ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Prévue</Text>
        </Space>
      ),
      dataIndex: 'date_prevue',
      key: '',
      align: 'center',
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
        ...(columnsVisibility['Preuve'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Retour</Text>
        </Space>
      ),
        dataIndex: 'date_retour',
        key: 'date_retour',
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
        ...(columnsVisibility['Retour'] ? {} : { className: 'hidden-column' }),
    },
    {   
      title: (
        <Space>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong>Statut</Text>
        </Space>
        ),
        dataIndex: 'nom_statut_bs',
        key: 'nom_statut_bs',
        render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
              <div style={columnStyles.title} className={columnStyles.hideScroll}>
                <Tag icon={icon} color={color}>{text}</Tag>
              </div>
            );
        },
        ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: (
        <Space>
          <Text strong>Commentaire</Text>
        </Space>
      ),
      dataIndex: 'commentaire',
      key: 'commentaire',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={columnStyles.title} className={columnStyles.hideScroll}>
            <Text  type="secondary">{text}</Text>
          </div>
        </Tooltip>
      ),
      ...(columnsVisibility['Commentaire'] ? {} : { className: 'hidden-column' }),
    },
          {
        title: (
          <Space>
            <UserOutlined style={{ color: 'orange' }} />
            <Text strong>Crée par</Text>
          </Space>
        ),
        dataIndex: 'created',
        key: 'created',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text  type="secondary">{text}</Text>
          </Tooltip>
        ),
        ...(columnsVisibility['Crée par'] ? {} : { className: 'hidden-column' })
      },
    {
      title: (<Text strong>Actions</Text>),
      key: 'action',
      align: 'center',
      ellipsis: {
        showTitle: false,
      },
        render: (text, record) => (
        <Space size="small">
        <Tooltip title={record.statut === 4  || record.statut === 9
          ? "Création de bon de sortie non autorisée" 
          : "Créer un bon de sortie"}
        >
            <Button
              type="text"
              disabled={ record.statut === 4 || record.statut === 9}
              icon={<FormOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handlSortie(record.id_affectation_demande)}
              aria-label="Modifier"
            />
          </Tooltip>
        </Space>
        ),
    },
  ]

  const filteredData = data.filter(item =>
     item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
     item.nom_destination?.toLowerCase().includes(searchValue.toLowerCase()) ||
     item.nom_service?.toLowerCase().includes(searchValue.toLowerCase()) ||
     item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <SwapOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Liste des Courses validées</h2>
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
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={handleAdd}
                >
                  Ajouter
                </Button>

                <Dropdown overlay={menus} trigger={['click']}>
                  <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                    colonne<DownOutlined />
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
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                bordered
                size="small"
                scroll={scroll}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
              />
            </div>
        </div>

        <Modal
          title=""
          visible={modalType === 'Add'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <AffectationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Bande'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <BandeSortieForm closeModal={() => setModalType(null)} fetchData={fetchData} affectationId={affectationId} />
        </Modal>
    </>
  )
}

export default AffectationDemande;