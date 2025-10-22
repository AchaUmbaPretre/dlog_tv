import { useState, useEffect, useRef } from 'react';
import { Button, notification } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, SoundOutlined } from '@ant-design/icons';
import ModeTv from '../modeTv/ModeTv';
import RapportVehiculeValide from '../rapportVehiculeValide/RapportVehiculeValide';
import RapportVehiculeCourses from '../rapportVehiculeCourses/RapportVehiculeCourses';
import RapportVehiculeUtilitaire from '../rapportVehiculeUtilitaire/RapportVehiculeUtilitaire';
import TopBarModelTv from '../../components/topBarModelTv/TopBarModelTv';
import AlertVehicule from '../alertVehicule/AlertVehicule';
import { getFalcon, getRapportCharroiVehicule, getRapportUtilitaire } from '../../services/rapportService';
import { getAlertVehicule, getEvent } from '../../services/alertService';
import './home.scss';
import config from '../../config';
import moment from 'moment';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [utilitaire, setUtilitaire] = useState([]);
  const [falcon, setFalcon] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const apiHash = config.api_hash;
  const lastAlertKeysRef = useRef(new Set());
  const intervalRef = useRef(null);
  const alertAudioRef = useRef(new Audio('/sounds/Sonnerie.mp3')); // mets ton fichier mp3 ici

  // Fonction pour activer le son (clic utilisateur obligatoire)
  const enableSound = () => setSoundEnabled(true);

  // Fetch données Falcon
  useEffect(() => {
    const fetchFalcon = async () => {
      try {
        const { data } = await getFalcon();
        setFalcon(data[0].items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFalcon();
    const interval = setInterval(fetchFalcon, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fusion courses + capteurs
  const mergedCourses = course.map(c => {
    const capteur = falcon.find(f => f.id === c.id_capteur);
    return { ...c, capteurInfo: capteur || null };
  });

  const componentsList = [
    <ModeTv key="modeTv" />,
    ...(data.length > 0 ? [<RapportVehiculeValide key="valide" data={data} />] : []),
    ...(mergedCourses.length > 0 ? [<RapportVehiculeCourses key="courses" course={mergedCourses} />] : []),
    ...(alertCount > 0 ? [<AlertVehicule key="alert"/>] : []),
    ...(utilitaire.length > 0 ? [<RapportVehiculeUtilitaire key="utilitaire" utilitaire={utilitaire} />] : []),
  ];


const fetchData = async () => {
  try {
    const [allData, utilData, alertData] = await Promise.all([
      getRapportCharroiVehicule(),
      getRapportUtilitaire(),
      getAlertVehicule()
    ]);

    setData(allData.data.listeEnAttente);
    setCourse(allData.data.listeCourse);
    setUtilitaire(utilData.data.listVehiculeDispo);

    const currentAlerts = alertData.data || [];

    // Crée une "clé" stable pour chaque alerte (par ex. device_id + type)
    const currentAlertKeys = new Set(
      currentAlerts.map(a => `${a.device_id}-${a.type || a.message}`)
    );

    // Détection des nouvelles clés
    const newAlerts = [...currentAlertKeys].filter(
      key => !lastAlertKeysRef.current.has(key)
    );

    if (soundEnabled && newAlerts.length > 0) {
      alertAudioRef.current.play().catch(err => console.log('Impossible de jouer le son', err));
      notification.warning({
        message: `🚨 Nouvelle alerte détectée`,
        description: `${newAlerts.length} nouvelle(s) alerte(s) ont été détectées.`,
        placement: 'topRight',
        duration: 5
      });
    }

    // Met à jour la mémoire
    lastAlertKeysRef.current = currentAlertKeys;
    setAlertCount(currentAlerts.length);

  } catch (error) {
    notification.error({
      message: 'Erreur de chargement',
      description: 'Une erreur est survenue lors du chargement des données.',
    });
    console.error(error);
  }
};


useEffect(() => {
  const fetchDatas = async () => {
    try {
      // 🕒 Définir les dates par défaut (aujourd’hui)
      const now = moment();
      const fromDefault = moment(now).startOf("day").format("YYYY-MM-DD HH:mm:ss");
      const toDefault = moment(now).endOf("day").format("YYYY-MM-DD HH:mm:ss");
      // 🔹 Appel API
      const { data } = await getEvent({
        date_from: fromDefault,
        date_to: toDefault,
        lang: "fr",
        limit: 1000,
        user_api_hash: apiHash,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error.message);
    }
  };

  // Lancer immédiatement puis toutes les 5 secondes
  fetchDatas();
  const interval = setInterval(fetchDatas, 30000);

  return () => clearInterval(interval);
}, []);

  // Intervalle de mise à jour
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Gestion de l'affichage cyclique
  useEffect(() => {
    if (currentIndex >= componentsList.length) setCurrentIndex(0);
  }, [componentsList, currentIndex]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % componentsList.length);
        setFade(true);
      }, 500);
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, componentsList.length]);

  return (
    <div className="home">
      <TopBarModelTv alert={alertCount} />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={() => setIsRunning(prev => !prev)}
          style={{ fontSize: '10px', padding: '0 10px', height:'20px', width:'20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        />
        {!soundEnabled && (
          <Button
            type="default"
            size="large"
            shape="round"
            icon={<SoundOutlined />}
            onClick={enableSound}
            style={{ marginLeft: 10, fontSize: '10px', padding: '0 10px', height:'20px', width:'20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
          </Button>
        )}
      </div>

{/*       <div className={`fade-container ${fade ? 'fade-in' : 'fade-out'}`}>
        {componentsList[currentIndex]}
      </div> */}
      <RapportVehiculeValide key="valide" data={data} />
    </div>
  );
};

export default Home;
