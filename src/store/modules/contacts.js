import axios from '../../axios_instance' 

export default {
    namespaced: true,
    state: {
        contacts: [],
        selectedContacts: []
    },
    actions: {
        SAVE_CONTACT({dispatch}, payload){
            // Edit mode exist id contact
            if(payload.id !== undefined){
                axios.put('/contacts/' + payload.id, payload)
                .then(() => {
                    dispatch('LOAD_USER_CONTACTS', payload.user_id)
                })
            }else{
                let { icon_color, lastname, name, phone, email, user_id } = payload
                axios.post('/contacts', { 
                    icon_color: icon_color,
                    lastname: lastname,
                    name: name,
                    phone: phone,
                    email: email,
                    user_id: user_id
                })
                .then(() => {
                    dispatch('LOAD_USER_CONTACTS', payload.user_id)
                })
            } 
        },
        async DELETE_CONTACTS({dispatch, state}, id_user){
            // Here I can't implement mass deleting contacts, because of json-server doesn't support it
            // That is why I'm using single deleting by mapping from selected contacts arr including contact IDs
            await Promise.all(
                state.selectedContacts.map((id_removal_contact) => {
                    axios.delete('/contacts/' + id_removal_contact)
                })
            ).then(() => {
                dispatch('LOAD_USER_CONTACTS', id_user)
                dispatch('CANCEL_SELECTED_CONTACTS')
            })

        },
        LOAD_USER_CONTACTS({commit}, id_user){
            axios.get('/contacts?user_id=' + id_user)
            .then((response) => {
                commit('loadContacts', response.data)
            })
            .catch(() => commit('loadContacts', []))
        },
        SELECTED_CONTACT_CHECK({commit}, contact_id){
            commit('addSelectedStack', contact_id)
        },
        CANCEL_SELECTED_CONTACTS({commit}){
            commit('clearSelectedStack')
        }
    },
    getters: {
        contacts(state){
            return state.contacts
        },
        selectedContacts(state){
            return state.selectedContacts
        }
    },
    mutations: {
        loadContacts(state, user_contacts){
            state.contacts = user_contacts
        },
        addSelectedStack(state, id_contact){
            if(state.selectedContacts.includes(id_contact)){
                state.selectedContacts = state.selectedContacts.filter(c_id => c_id !== id_contact) 
            }else{
                state.selectedContacts.push(id_contact) 
            } 
        },
        clearSelectedStack(state){ 
            state.selectedContacts = []
        }
    }
}