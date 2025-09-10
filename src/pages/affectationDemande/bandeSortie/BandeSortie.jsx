import { useEffect, useState } from 'react'
import { Table, Tag, Popconfirm, message, Dropdown, Space, Menu, Modal, Tooltip, Button, Typography, Input, notification } from 'antd';
import { CarOutlined, StockOutlined, ExclamationCircleOutlined, DeleteOutlined, ApartmentOutlined, AppstoreOutlined, FieldTimeOutlined, EnvironmentOutlined, FileTextOutlined, CloseOutlined, MenuOutlined, DownOutlined, TrademarkOutlined, ExportOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { statusIcons } from '../../../../utils/prioriteIcons';
import { getBandeSortie, putAnnulereBandeSortie, putEstSupprimeBandeSortie } from '../../../../services/charroiService';
import ValidationDemandeForm from '../../demandeVehicule/validationDemande/validationDemandeForm/ValidationDemandeForm';
import ReleveBonDeSortie from './releveBonDeSortie/ReleveBonDeSortie';
import BandeSortieDetail from './bandeSortieDetail/BandeSortieDetail';
import { useSelector } from 'react-redux';
import UpdateTime from './updateTime/UpdateTime';
import RapportBs from './rapportBs/RapportBs';

const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;

const BandeSortie = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [bonId, setBonId] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
      "#" : true,
      "Service" : true,
      "Chauffeur" : true,
      "Destination" : true,
      "Retour effectif" : true,
      "Depart" : true,
      "Véhicule" : true,
      "Immatriculation": true,
      "Marque" : false,
      "Preuve" : true,
      "Retour" : true,
      "Statut" : true,
      "Client" : false,
      "Demandeur" : true,
      "Agent" : false,
      "Créé par" : false
      });
    const columnStyles = {
      title: {
        maxWidth: '160px',
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

    const handlSortie = (id) => openModal('validation', id);
    const handleReleve = (id) => openModal('releve', id);
    const handleDetail = (id) => openModal('detail', id);
    const handleUpdateTime = (id) => openModal('dateTime', id);
    const handleRapportBs = () => openModal('rapport');

    const closeAllModals = () => {
      setModalType(null);
    };

    const handleDelete = async(id, idVehicule) => {
      try {
        await putEstSupprimeBandeSortie(id, idVehicule, userId);
        setData((prevData) => prevData.filter((item) => item.id_bande_sortie  !== id));
        message.success("Le bon de sortie a été supprimée avec succès.");
      } catch (error) {
          notification.error({
          message: 'Erreur de suppression',
          description: 'Une erreur est survenue lors de la suppression du bon.',
        });
      }
    }

    const openModal = (type, id = '') => {
      closeAllModals();
      setModalType(type);
      setBonId(id)
    };
    
    const handleExportExcel = () => {
      message.success('Exporting to Excel...');
    };

    const handleExportPDF = () => {
      message.success('Exporting to PDF...');
    };

    const fetchData = async() => {
      try {
        const { data } = await  getBandeSortie(userId)
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
    }, [userId]);

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

    const handleAnnuler = (id_bande_sortie, id_vehicule) => {
      confirm({
        title: "Voulez-vous vraiment annuler ce bon ?",
        icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
        content: `Le bon de sortie n°${id_bande_sortie} sera définitivement annulé.`,
        okText: "Oui, annuler",
        cancelText: "Non, garder",
        okType: "danger",
        centered: true,
        async onOk() {
          const loadingKey = "loadingAnnuler";

          message.loading({
            content: "Traitement en cours, veuillez patienter...",
            key: loadingKey,
            duration: 0,
          });

          setLoading(true);

          try {
            await putAnnulereBandeSortie(id_bande_sortie, id_vehicule, userId);

            message.success({
              content: `Le bon de sortie ${id_bande_sortie} a été annulé avec succès.`,
              key: loadingKey,
            });

            fetchData();
          } catch (error) {
            console.error("Erreur lors de l'annulation :", error);

            message.error({
              content: "Une erreur est survenue lors de l'annulation.",
              key: loadingKey,
            });
          } finally {
            setLoading(false);
          }
        },
      });
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
        title: (
          <span>
            <ApartmentOutlined style={{ marginRight: 6, color: '#1d39c4' }} />
            Demandeur
          </span>
        ),
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
        render: (text, record) => (
          <Tooltip placement="topLeft" title={text}>
            <div style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleDetail(record.id_bande_sortie)}>
              <Text  type="secondary">{text}</Text>
            </div>
          </Tooltip>
        ),
        ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: (
          <Space>
            <UserOutlined  style={{color:'orange'}}/>
            <Text strong>Agent</Text>
          </Space>
        ),
        dataIndex: 'personne_bord',
        key: 'personne_bord',
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <Text type="secondary">{text}</Text>
          </Tooltip>
        ),
        ...(columnsVisibility['Agent'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: (
          <Space>
            <CarOutlined style={{ color: 'green' }} />
            <Text strong>Véhicule</Text>
          </Space>
        ),
        dataIndex:'nom_cat',
        key: 'nom_cat',
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
        ...(columnsVisibility['Véhicule'] ? {} : { className: 'hidden-column' })
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
              {text}
            </Tag>
          </Tooltip>
        ),
        ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' })
      },
      {
        title: (
          <Space>
            <FieldTimeOutlined style={{ color: 'blue' }} />
            <Text strong>Sortie prevue</Text>
          </Space>
        ),
        dataIndex: 'date_prevue',
        key: 'date_prevue',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
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
            <Tag icon={<FieldTimeOutlined />} color={isValid ? "blue" : "red"}>
              {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
            </Tag>
          );
        },  
        ...(columnsVisibility['Preuve'] ? {} : { className: 'hidden-column' })
      },
      {
        title: (
          <Space>
            <FieldTimeOutlined style={{ color: 'blue' }} />
            <Text strong>Retour prevu</Text>
          </Space>
        ),
        dataIndex: 'date_retour',
        key: 'date_retour',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
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
            <Tag icon={<FieldTimeOutlined />} color={isValid ? "blue" : "red"}>
              {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
            </Tag>
          );
        },
        ...(columnsVisibility['Retour'] ? {} : { className: 'hidden-column' })

      },
      {
        title: (
          <Space>
            <CalendarOutlined style={{ color: 'blue' }} />
            <Text strong>Depart</Text>
          </Space>
        ),
        dataIndex: 'sortie_time',
        key: 'sortie_time',
        align: 'center',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          if (!text) {
            return (
              <Tag icon={<CalendarOutlined />} color="red" onClick={() => handleUpdateTime(record.id_bande_sortie)}>
                N'est pas sorti
              </Tag>
            );
          }
          const date = moment(text);
          const isValid = date.isValid();              
            return (
              <Tag icon={<CalendarOutlined />} color={isValid ? "purple" : "red"} onDoubleClick={() => handleUpdateTime(record.id_bande_sortie)}>
                {isValid ? date.format('DD-MM-YYYY HH:mm') : "N'est pas sorti"}
              </Tag>
            );
        },
        ...(columnsVisibility['Depart'] ? {} : { className: 'hidden-column' })
      },
      {
        title: (
          <Space>
            <CalendarOutlined style={{ color: 'blue' }} />
            <Text strong>Retour</Text>
          </Space>
        ),
        dataIndex: 'retour_time',
        key: 'retour_time',
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => {
          if (!text) {
              return (
                  <Tag icon={<CalendarOutlined />} color="red" onClick={() => handleUpdateTime(record.id_bande_sortie)}>
                      N'est pas retourné
                  </Tag>
              );
          }
          const date = moment(text);
          const isValid = date.isValid();              
              return (
                  <Tag icon={<CalendarOutlined />} color={isValid ? "purple" : "red"} onDoubleClick={() => handleUpdateTime(record.id_bande_sortie)}>
                    {isValid ? date.local().format('DD-MM-YYYY HH:mm ') : 'Nest pas retourné'}
                  </Tag>
              );
          },
        ...(columnsVisibility['Retour effectif'] ? {} : { className: 'hidden-column' })
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
      },
      {
        title: (
          <Space>
            <UserOutlined style={{ color: 'orange' }} />
            <Text strong>Créé par</Text>
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
        ...(columnsVisibility['Créé par'] ? {} : { className: 'hidden-column' })
      },
      {
          title: (
          <Text strong>Actions</Text>
          ),
          key: 'action',
          align: 'center',
          ellipsis: {
            showTitle: false,
          },
          render: (text, record) => (
          <Space size="small">

              <Tooltip title="Relevé des bons de sortie">
                <Button
                  icon={<FileTextOutlined />}
                  style={{ color: 'blue' }}
                  onClick={() => handleReleve(record.id_bande_sortie)}
                  aria-label="Relevé"
                />
              </Tooltip>

              <Tooltip title={record.utilisateur_a_valide ? "Vous avez déjà validé" : "Valider"}>
              <Button
                icon={
                  record.utilisateur_a_valide
                    ? <CheckCircleOutlined style={{ color: 'gray' }} />
                    : <CheckCircleOutlined />
                }
                style={{
                  color: record.utilisateur_a_valide ? 'gray' : 'green',
                }}
                onClick={() => handlSortie(record.id_bande_sortie)}
                disabled={record.utilisateur_a_valide}
                aria-label="Valider"
              />
            </Tooltip>


              <Tooltip title="Annuler le BS">
                  <Button
                    icon={<CloseOutlined />}
                    style={{ color: 'red' }}
                    onClick={() => handleAnnuler(record.id_bande_sortie, record.id_vehicule)}
                    aria-label="Annuler"
                    disabled = {record.nom_statut_bs === 'Retour' || record.nom_statut_bs === 'Annulé' || record.nom_statut_bs === 'Départ' }
                  />
              </Tooltip>

              <Tooltip title="Supprimer">
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer ce bon de sortie ?"
                  onConfirm={() => handleDelete(record.id_bande_sortie, record.id_vehicule)}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    style={{ color: 'red' }}
                    aria-label="Delete bon"
                    disabled = {record.nom_statut_bs === 'Retour'}
                  />
                </Popconfirm>
            </Tooltip>
          </Space>
          ),
      },
    ]

    const filteredData = data.filter(item =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_destination?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <ExportOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Tableau des bons de sortie</h2>
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

                <Tooltip title="Cliquez pour voir le rapport complet">
                  <Button
                    type="primary"
                    icon={<StockOutlined />}
                    onClick={handleRapportBs}
                    style={{
                      backgroundColor: '#6a8bff',
                      borderColor: '#6a8bff',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '8px 20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                    aria-label="Générer le rapport des stocks"
                  >
                    Générer Rapport
                  </Button>
                </Tooltip>

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
            visible={modalType === 'validation'}
            onCancel={closeAllModals}
            footer={null}
            width={1020}
            centered
        >
            <ValidationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'releve'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <ReleveBonDeSortie closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'detail'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
          <BandeSortieDetail closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'dateTime'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <UpdateTime closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'rapport'}
          onCancel={closeAllModals}
          footer={null}
          width={1150}
          centered
        >
          <RapportBs />
        </Modal>
    </>
  )
}

export default BandeSortie;