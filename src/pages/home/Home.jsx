import ModeTv from '../modeTv/ModeTv'
import RapportVehiculeValide from '../rapportVehiculeValide/RapportVehiculeValide'
import RapportVehiculeCourses from '../rapportVehiculeCourses/RapportVehiculeCourses'
import RapportVehiculeUtilitaire from '../rapportVehiculeUtilitaire/RapportVehiculeUtilitaire'

const Home = () => {
  return (
    <>
        <div className="home">
            <ModeTv/>
            <RapportVehiculeValide/>
            <RapportVehiculeCourses/>
            <RapportVehiculeUtilitaire/>
        </div>
    </>
  )
}

export default Home