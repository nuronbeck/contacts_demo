import axios from '../../axios_instance'

export default {
    namespaced: true,
    state: {
        isLogged: false,
        user: [],
    },
    actions: {
        CHECK_USER_BY_TOKEN({commit}){
            if(localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_token') !== 'undefined'){
                let auth_token = localStorage.getItem('auth_token')
                // Promise for vue router to check user token from localstorage if exists for auth when reloading page
                return new Promise((resolve, reject) => {
                    axios.get(`/users?token=${auth_token}`)
                    .then((response) => {
                        if(Object.keys(response.data).length !== 0){
                            commit('authorizateUser', {
                                id_user: response.data[0].id_user,
                                email: response.data[0].email,
                                token: response.data[0].token
                            })
                            resolve(true)
                        }else{
                            commit('clearUser')
                            reject(false)
                        }
                    })
                })
            }else{ 
                commit('clearUser') 
            }            
        },
        LOGIN ({commit}, payload){
            return new Promise((resolve, reject) => {
                let { email, password } = payload

                axios.get(`/users?email=${email}&password=${password}`)
                .then((response) => {
                    if(Object.keys(response.data).length !== 0){
                        commit('authorizateUser', {
                            id_user: response.data[0].id_user,
                            email: response.data[0].email,
                            token: response.data[0].token
                        })
                        resolve(true)
                    }else{
                        commit('clearUser')
                        reject('Error! Incorrect email or password!')
                    }
                }).catch(err => reject(err))
            })
        },
        LOGOUT({commit}){
            commit('clearUser')
        }
    },
    getters: {
        user: state => state.user,
        isLogged: state => state.isLogged
    },
    mutations: {
        authorizateUser(state, user_data){
            state.user = user_data
            localStorage.setItem('auth_token', user_data.token)
            state.isLogged = true
        },
        clearUser(state){
            state.user = []
            localStorage.removeItem('auth_token')
            state.isLogged = false 
        }
    }
}