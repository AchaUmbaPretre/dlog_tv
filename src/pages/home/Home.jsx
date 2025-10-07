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
import { getAlertVehicule } from '../../services/alertService';
import './home.scss';

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

  const prevAlertCountRef = useRef(0);
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

  // Fetch données principales et alertes
/*   const fetchData = async () => {
    try {
      const [allData, utilData, alertData] = await Promise.all([
        getRapportCharroiVehicule(),
        getRapportUtilitaire(),
        getAlertVehicule()
      ]);

      setData(allData.data.listeEnAttente);
      setCourse(allData.data.listeCourse);
      setUtilitaire(utilData.data.listVehiculeDispo);

      // Gestion des alertes
      const currentCount = alertData.data.length;
      if (soundEnabled && currentCount > prevAlertCountRef.current) {
        // Nouvelle alerte détectée → jouer le son
        alertAudioRef.current.play().catch(err => console.log('Impossible de jouer le son', err));
        notification.warning({
          message: `🚨 Nouvelle alerte !`,
          description: `${currentCount - prevAlertCountRef.current} nouvelle(s) alerte(s) détectée(s)`,
          placement: 'topRight'
        });
      }
      prevAlertCountRef.current = currentCount;
      setAlertCount(currentCount);

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
      console.error(error);
    }
  }; */

  const [lastAlertIds, setLastAlertIds] = useState([]);

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
    const currentIds = currentAlerts.map(a => a.id);

    const newAlerts = currentIds.filter(id => !lastAlertIds.includes(id));

    if (soundEnabled && newAlerts.length > 0) {
      alertAudioRef.current.play().catch(err => console.log('Impossible de jouer le son', err));
      notification.warning({
        message: `🚨 Nouvelle alerte détectée`,
        description: `${newAlerts.length} nouvelle(s) alerte(s) ont été détectées.`,
        placement: 'topRight',
        duration: 5
      });
    }

    // Mise à jour du cache
    setLastAlertIds(currentIds);
    setAlertCount(currentIds.length);

  } catch (error) {
    notification.error({
      message: 'Erreur de chargement',
      description: 'Une erreur est survenue lors du chargement des données.',
    });
    console.error(error);
  }
};

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
          style={{ fontSize: '18px', padding: '0 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        />
        {!soundEnabled && (
          <Button
            type="default"
            size="large"
            shape="round"
            icon={<SoundOutlined />}
            onClick={enableSound}
            style={{ marginLeft: 10 }}
          >
            Activer alertes sonores
          </Button>
        )}
      </div>

      <div className={`fade-container ${fade ? 'fade-in' : 'fade-out'}`}>
        {componentsList[currentIndex]}
      </div>
    </div>
  );
};

export default Home;
