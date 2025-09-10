import { useEffect, useState } from 'react'
import { Form, Row, Checkbox, Modal, Tooltip, Input, Card, Col, DatePicker, message, Skeleton, Select, Button } from 'antd';
import { getChauffeur, getDemandeVehiculeOne, getDestination, getMotif, getServiceDemandeur, getVehiculeDispo, postAffectationDemande } from '../../../../services/charroiService';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getClient } from '../../../../services/clientService';
import moment from 'moment';
import DestinationForm from '../../demandeVehicule/destination/destinationForm/DestinationForm';
import ClientForm from '../../../client/clientForm/ClientForm';
import BandeSortieForm from '../bandeSortie/bandeSortieForm/BandeSortieForm';

const AffectationDemandeForm = ({closeModal, fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [ motif, setMotif ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);
    const [ affectationId, setAffectationId ] = useState('')
    const [ destination, setDestination ] = useState([]);
    const [ modalType, setModalType ] = useState(null);
    const [createBS, setCreateBS] = useState(true);

    const fetchDatas = async() => {
        setLoadingData(true);
        try {
            const [vehiculeData, chaufferData, serviceData, motifData, clientData, localData] = await Promise.all([
                getVehiculeDispo(),
                getChauffeur(),
                getServiceDemandeur(),
                getMotif(),
                getClient(),
                getDestination()
            ]);

            setVehicule(vehiculeData.data);
            setChauffeur(chaufferData.data?.data);
            setService(serviceData.data);
            setMotif(motifData.data);
            setClient(clientData.data);
            setDestination(localData.data);

            if(id_demande_vehicule) {
                const { data : d } = await getDemandeVehiculeOne(id_demande_vehicule);
                form.setFieldsValue({
                    date_prevue : moment(d[0].date_prevue),
                    date_retour : moment(d[0].date_retour),
                    id_type_vehicule : d[0].id_type_vehicule,
                    id_motif_demande : d[0].id_motif_demande,
                    id_demandeur : d[0].id_demandeur,
                    id_client : d[0].id_client,
                    id_destination : d[0].id_destination,
                    personne_bord : d[0].personne_bord
                })
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchDatas();
    }, [id_demande_vehicule])
    
        const closeAllModals = () => {
        setModalType(null);
    };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const handleDestination = () => openModal('Destination');
    const handleClient = () => openModal('Client')

    const onFinish = async (values) => {
        await form.validateFields();
        console.log(values)

        const loadingKey = 'loadingAffectation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);

        try {
            
            const response = await postAffectationDemande({
                ...values,
                id_demande_vehicule : id_demande_vehicule,
                user_cr: userId
            })

            const newId = response.data?.id_affectation;
            setAffectationId(newId);
            
            message.success({ content: "La course a été mise a jour avec succès.", key: loadingKey });
            form.resetFields();
            fetchData();
            closeModal();

            if (createBS) {
                setModalType('Bande');
                closeModal();
            }

        } catch (error) {
            console.error("Erreur lors de l'ajout de course :", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Formulaire de validation de course</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={vehicule?.map((item) => ({
                                        value: item.id_vehicule,
                                        label: item.modele
                                        ? `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`
                                        : `${item.immatriculation} / ${item.nom_marque}`,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un vehicule..."
                                    />

                                }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Chauffeur"
                                    name="id_chauffeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur?.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: item.nom
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un chauffeur..."
                                />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heure de départ prévue"
                                    name="date_prevue"
                                    rules={[{ required: true, message: "Veuillez fournir la date et l'heure" }]}
                                >
                                    <DatePicker
                                    style={{ width: '100%' }}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Choisir date et heure"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heure de retour prévue"
                                    name="date_retour"
                                    dependencies={['date_prevue']}
                                    rules={[
                                    {
                                        required: true,
                                        message: "Veuillez fournir la date et l'heure de retour",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                        const depart = getFieldValue('date_prevue');
                                        if (!value || !depart) return Promise.resolve();

                                        if (value.isAfter(depart)) {
                                            return Promise.resolve(); // OK si après en date ou en heure
                                        }

                                        return Promise.reject(
                                            new Error("La date de retour doit être strictement postérieure à la date de départ.")
                                        );
                                        },
                                    }),
                                    ]}
                                >
                                    <DatePicker
                                    style={{ width: '100%' }}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Choisir date et heure"
                                    />
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Motif"
                                    name="id_motif_demande"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={motif?.map((item) => ({
                                            value: item.id_motif_demande,
                                            label: `${item.nom_motif_demande}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Service demandeur"
                                    name="id_demandeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un demandeur' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={service?.map((item) => ({
                                            value: item.id_service_demandeur,
                                            label: `${item.nom_service}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Client"
                                    name="id_client"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={client?.map((item) => ({
                                            value: item.id_client,
                                            label: `${item.nom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                                <Tooltip title={'Ajouter un client'}>
                                    <Button 
                                        style={{ width:'19px', height:'19px' }}
                                        icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                        onClick={handleClient}
                                    >
                                    </Button>
                                </Tooltip>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Destination"
                                    name="id_destination"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une destination.' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={destination?.map((item) => ({
                                            value: item.id_destination ,
                                            label: `${item.nom_destination}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                                <Tooltip title={'Ajouter une destination'}>
                                    <Button 
                                        style={{ width:'19px', height:'19px' }}
                                        icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                        onClick={handleDestination}
                                    >
                                    </Button>
                                </Tooltip>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Personne(s) à bord"
                                    name="personne_bord"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Input  placeholder="Saisir..." style={{width:'100%'}}/>
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Commentaire"
                                    name="commentaire"
                                >
                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'70px'}}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Checkbox
                                    checked={createBS}
                                    onChange={e => setCreateBS(e.target.checked)}
                                >
                                    Créer bon de BS
                                </Checkbox>
                            </Col>


                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                    Soumettre
                                </Button>
                            </div>
                        </Row>
                    </Card>
                </Form>
            </div>
        </div>

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
        <Modal
            title=""
            visible={modalType === 'Destination'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <DestinationForm closeModal={() => setModalType(null)} fetchData={fetchDatas} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Client'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <ClientForm closeModal={() => setModalType(null)} fetchData={fetchDatas} />
        </Modal>
    </>
  )
}

export default AffectationDemandeForm