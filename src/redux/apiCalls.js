import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";
import { message } from "antd";
import config from "../config";

export const login = async (dispatch, user, navigate) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;


  dispatch(loginStart());
  try {
    const res = await axios.post(`${DOMAIN}/api/auth/login`, user);
    dispatch(loginSuccess(res.data));
    if (res.data.success) {
      message.success("Connectez-vous avec succès");
      const role = res.data?.role;

      if (role === 'Securité') {
        navigate('/securite/dashboard');
      } else {
        navigate('/');
      }

    } else {
      navigate('/login')
      message.error(res.data.message);
    }
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const register = async (dispatch, user) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  dispatch(loginStart());
  try {
    const res = await axios.post(`${DOMAIN}/api/auth/register`, user);
    dispatch(loginSuccess(res.data));
    if (res.data.success) {
      message.success("Les informations sont enregistrées avec succès");
    } else {
      message.error(res.data.message);
    }
  } catch (err) {
    dispatch(loginFailure());
    console.log(err);
    message.error("Quelque chose s'est mal passé");
  }
};

