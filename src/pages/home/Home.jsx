import { useState, useEffect, useRef } from 'react';
import { Button, notification } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import ModeTv from '../modeTv/ModeTv';
import RapportVehiculeValide from '../rapportVehiculeValide/RapportVehiculeValide';
import RapportVehiculeCourses from '../rapportVehiculeCourses/RapportVehiculeCourses';
import RapportVehiculeUtilitaire from '../rapportVehiculeUtilitaire/RapportVehiculeUtilitaire';
import TopBarModelTv from '../../components/topBarModelTv/TopBarModelTv';
import { getFalcon, getRapportCharroiVehicule, getRapportUtilitaire } from '../../services/rapportService';
import './home.scss';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [utilitaire, setUtilitaire] = useState([]);
  const [falcon, setFalcon] = useState([]);
  const [isRunning, setIsRunning] = useState(true);

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const { data } = await getFalcon();
        setFalcon(data[0].items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDatas();
    const interval = setInterval(fetchDatas, 5000);
    return () => clearInterval(interval);
  }, []);

  const mergedCourses = course.map(c => {
    const capteur = falcon.find(f => f.id === c.id_capteur);
    return {
      ...c,
      capteurInfo: capteur || null,
    };
  });

  const componentsList = [
    <ModeTv key="modeTv" />,
    ...(data.length > 0 ? [<RapportVehiculeValide key="valide" data={data} />] : []),
    ...(mergedCourses.length > 0 ? [<RapportVehiculeCourses key="courses" course={mergedCourses} />] : []),
    ...(utilitaire.length > 0 ? [<RapportVehiculeUtilitaire key="utilitaire" utilitaire={utilitaire} />] : []),
  ];

  const fetchData = async () => {
    try {
      const [allData, utilData] = await Promise.all([
        getRapportCharroiVehicule(),
        getRapportUtilitaire(),
      ]);

      setData(allData.data.listeEnAttente);
      setCourse(allData.data.listeCourse);
      setUtilitaire(utilData.data.listVehiculeDispo);

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Sécurité : réinitialiser l’index si plus grand que la longueur de la liste
  useEffect(() => {
    if (currentIndex >= componentsList.length) {
      setCurrentIndex(0);
    }
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
    }, 30000); // ⏱️ change toutes les 30s

    return () => clearInterval(intervalRef.current);
  }, [isRunning, componentsList.length]);

  return (
    <div className="home">
      <TopBarModelTv />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={() => setIsRunning(prev => !prev)}
          style={{
            fontSize: '16px',
            padding: '0 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <div className={`fade-container ${fade ? 'fade-in' : 'fade-out'}`}>
        {componentsList[currentIndex]}
      </div>
    </div>
  );
};

export default Home;
