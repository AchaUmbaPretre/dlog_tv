import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

//Kiosque
export const getRapportKiosque = async (params) => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_kiosque`, { params });
};

//Rapport Charroi vehicule
export const getRapportCharroiVehicule = async (params) => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_charroi_vehicule`, { params });
};

//Rapport utilitaire
export const getRapportUtilitaire = async () => {
  return axios.get(`${DOMAIN}/api/rapport/rapport_utilitaire`);
};

export const getFalcon = async () => {
  return axios.get('https://apidlog.loginsmart-cd.com/api/falcon'); // toujours en HTTPS car ton site est en HTTPS
};