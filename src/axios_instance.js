import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://contacts-demo-vue.herokuapp.com/' //'http://localhost:3000'
})
export default instance