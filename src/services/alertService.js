import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN

export const getAlertVehicule = async () => {
  return axios.get(`${DOMAIN}/api/event/vehicule_alert`);
};

export const markAlertAsRead = async (id) => {
  return axios.put(`${DOMAIN}/api/event/vehicule_alert?id=${id}`);
};