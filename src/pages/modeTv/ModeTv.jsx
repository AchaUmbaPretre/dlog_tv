import { useEffect, useState } from 'react';
import ModelEvenementLive from './modelEvenementLive/ModelEvenementLive';
import './modeTv.scss'
import ModeTvCardPonct from './modeTvCardPonct/ModeTvCardPonct';
import ModeTvService from './modeTvService/ModeTvService';
import TableauHorsTiming from './tableauHorsTiming/TableauHorsTiming';
import { InfoCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { getRapportKiosque } from '../../services/rapportService';
import AlertTimeline from './alertTimeline/AlertTimeline';

const ModeTv = () => {
    const [data, setData] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [courseService, setCourseService] = useState([]);
    const [courseChauffeur, setCourseChauffeur] = useState([]);
    const [evenementLiveRow, setEvenementLiveRow] = useState([]);
    const [departHorsTimingRow, setDepartHorsTimingRow] = useState([]);
    const [utilisationParc, setUtilisationParc] = useState([]);
    const [departHorsTimingCompletRow, setDepartHorsTimingCompletRow] = useState([]);
    const [motif, setMotif] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const { data } = await getRapportKiosque();
            setAnomalies(data?.anomalies);
            setData(data?.total);
            setCourseService(data?.courseService);
            setCourseChauffeur(data?.courseChauffeur);
            setEvenementLiveRow(data?.evenementLive);
            setDepartHorsTimingRow(data?.departHorsTiming);
            setUtilisationParc(data?.utilisationParc);
            setDepartHorsTimingCompletRow(data?.departHorsTimingCompletRows);
            setMotif(data.motifRows)
        }
        fetchData()

        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval); 
    }, []);

  return (
    <>
        <div className="mode_tv">
           <div className="model_tv_wrapper">
                <div className="model_tv_left">
                    <div className="model_tv_anomalie">
                        <div className="anomalie_left">
                            <h3 className="anomalie_h3">Anomalies du jour</h3>
                            <div className="anomalie_wrapper">
                            <div className="anomalie_card danger">
                                <InfoCircleFilled className="anomalie_icon" />
                                <span className="anomalie_desc">
                                Départs sans validation {anomalies.depart_non_valide}
                                </span>
                                {anomalies.depart_non_valide > 0 && (
                                <span className="anomalie_badge">!</span>
                                )}
                            </div>

                            <div className="anomalie_card warning">
                                <InfoCircleOutlined className="anomalie_icon" />
                                <span className="anomalie_desc">
                                Départs en retard {anomalies.depart_en_retard}
                                </span>
                                {anomalies.depart_en_retard > 0 && (
                                <span className="anomalie_badge">!</span>
                                )}
                            </div>

                            <div className="anomalie_card warning">
                                <InfoCircleOutlined className="anomalie_icon" />
                                <span className="anomalie_desc">
                                Retours en retard {anomalies.retour_en_retard}
                                </span>
                                {anomalies.retour_en_retard > 0 && (
                                <span className="anomalie_badge">!</span>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>

                    <ModeTvCardPonct datas={data} utilisationParc={utilisationParc} />
                    <ModeTvService dataService={courseService} courseVehicule={courseChauffeur} motif={motif} />
                
                </div>
                <div className="model_tv_right">
                    <AlertTimeline departHorsTimingRow={departHorsTimingRow}/>
              </div>
            </div>
            <TableauHorsTiming departHorsTimingRow={departHorsTimingCompletRow} />
        </div>
    </>
  )
}

export default ModeTv