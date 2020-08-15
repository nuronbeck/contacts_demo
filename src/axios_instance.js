import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://contacts-demo-vue.herokuapp.com/api' //'http://localhost:3000'
})
export default instance