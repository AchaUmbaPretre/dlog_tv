import axios from "axios";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;

const config = {
   REACT_APP_SERVER_DOMAIN : 'https://apidlog.loginsmart-cd.com',

   api_hash : '$2y$10$FbpbQMzKNaJVnv0H2RbAfel1NMjXRUoCy8pZUogiA/bvNNj1kdcY.'

/*   REACT_APP_SERVER_DOMAIN : 'https://apidlog.loginsmart-cd.com'
 */ };

export default config;

export const userRequest = axios.create({
  baseURL: 'https://apidlog.loginsmart-cd.com',
  headers: { Authorization: `Bearer ${TOKEN}` },
});