import axios from 'axios';

const api = axios.create({
    // baseURL: "https://rocketseat-node.herokuapp.com/api"
    baseURL: "http://192.168.0.35:3333/api"
});

export default api;