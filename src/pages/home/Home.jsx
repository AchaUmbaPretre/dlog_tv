import { useState, useEffect } from 'react';
import ModeTv from '../modeTv/ModeTv';
import RapportVehiculeValide from '../rapportVehiculeValide/RapportVehiculeValide';
import RapportVehiculeCourses from '../rapportVehiculeCourses/RapportVehiculeCourses';
import RapportVehiculeUtilitaire from '../rapportVehiculeUtilitaire/RapportVehiculeUtilitaire';
import './home.scss';

const componentsList = [
  <ModeTv key="modeTv" />,
  <RapportVehiculeValide key="valide" />,
  <RapportVehiculeCourses key="courses" />,
  <RapportVehiculeUtilitaire key="utilitaire" />
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // commence le fade-out
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % componentsList.length);
        setFade(true); // fade-in le nouveau composant
      }, 500); // durée du fade-out
    }, 3000); // toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className={`fade-container ${fade ? 'fade-in' : 'fade-out'}`}>
        {componentsList[currentIndex]}
      </div>
    </div>
  );
}

export default Home;
