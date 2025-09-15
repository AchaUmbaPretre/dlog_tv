import { useState, useEffect } from 'react';
import ModeTv from '../modeTv/ModeTv';
import RapportVehiculeValide from '../rapportVehiculeValide/RapportVehiculeValide';
import RapportVehiculeCourses from '../rapportVehiculeCourses/RapportVehiculeCourses';
import RapportVehiculeUtilitaire from '../rapportVehiculeUtilitaire/RapportVehiculeUtilitaire';
import './home.scss';
import TopBarModelTv from '../../components/topBarModelTv/TopBarModelTv';
import { notification } from 'antd';
import { getRapportCharroiVehicule } from '../../services/rapportService';


const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [data, setData] = useState([]);
  const [course, setCourse] = useState([]);
  const [utilitaire, setUtilitaire] = useState([])

  const componentsList = [
    <ModeTv key="modeTv" />,
    <RapportVehiculeValide key="valide" data={data} />,
    <RapportVehiculeCourses key="courses" course={course} />,
    <RapportVehiculeUtilitaire key="utilitaire" utilitaire={utilitaire} />
    ];

    const fetchData = async() => {
        try {
            const { data } = await getRapportCharroiVehicule();

            setData(data.listeEnAttente);
            setCourse(data.listeCourse);
            setUtilitaire(data.listeUtilitaire);

        } catch (error) {
            notification.error({
            message: 'Erreur de chargement',
            escription: 'Une erreur est survenue lors du chargement des données.',
            });
        }
    }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % componentsList.length);
        setFade(true); // fade-in le nouveau composant
      }, 500);
    }, 30000); // toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
        <TopBarModelTv/>
        <div className={`fade-container ${fade ? 'fade-in' : 'fade-out'}`}>
            {componentsList[currentIndex]}
        </div>
    </div>
  );
}

export default Home;
