import { useEffect, useState } from 'react'
import './alertVehicule.scss'
import { getAlertVehicule, markAlertAsRead } from '../../services/alertService';

const AlertVehicule = ({alerts}) => {
    const [ loading, setLoading ] = useState([]);

    const alertAsRead = async(id) => {
        try {
            await markAlertAsRead(id)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
        <div className="alert_vehicule">
            <div className="alert_wrapper">
                <div className="alert_row">

                </div>
            </div>
        </div>
    </>
  )
}

export default AlertVehicule