<template>
  <v-row class="text-center fill-height justify-center align-content-start">
    <v-col cols="12">
      <h2 class="display-0 font-weight-bold">
        Contacts List
      </h2>
    </v-col>

    
    <v-col
      class="mb-5 "
      cols="12"
    >
      <v-data-table
        :headers="headers"
        :search="search"
        :items="contacts"  
        :single-select="false"
        item-key="id" 
        show-select 
        no-data-text="Contacts is empty"
        disable-pagination
        disable-items-per-page 
        disable-sort
        hide-default-footer
        hide-default-header 
      >       
        <template v-slot:top> 
          <v-text-field  
            solo
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
            v-model="search"
            class="mb-2"
          ></v-text-field> 
        </template>
        <template v-slot:item="{ item }"> 
          <tr style="transition: background-color 0.15s ease-in-out; cursor: pointer;"
            :style="selectedContacts.includes(item.id) ? { backgroundColor: '#bde6f9' } : { }"
          >
            <td :style="{ textAlign: 'left' }">
              <v-btn  
                :color="item.icon_color"
                class="ma-1 white--text headline"
                fab @click="selectContact(item.id)"
              >
                {{ getFirstLetter(item.lastname, item.name) }}
              </v-btn>
            </td>
            <td :style="{ textAlign: 'left' }" @click="showContact(item)">
              {{ item.name }} {{ item.lastname }} 
            </td>
            <td class="hidden-sm-and-down" @click="showContact(item)">
              {{ item.phone }}
            </td>
            <td class="hidden-sm-and-down" @click="showContact(item)">
              {{ item.email }}
            </td>
          </tr>
        </template>
  </v-data-table>
    </v-col>
    
    <v-btn
      bottom
      color="light-green"
      dark
      fab
      fixed
      right
      @click="addContact"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-card>
        <v-card-title class="light-blue white--text">
          {{ dialog_mode == 'add' ? 'Create new contact' : dialog_mode == 'edit' ? 'Contact information' : 'Contact' }}
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="12">
              <v-text-field
                solo
                prepend-inner-icon="mdi-account-box"
                placeholder="Name"
                v-model="newContact.name" 
                :error-messages="$v.newContact.name.$invalid ? 'Name is required' : ''" 
                @change="$v.newContact.name.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                solo
                hide-details
                prepend-inner-icon="mdi-account-box-multiple"
                placeholder="Lastname"
                v-model="newContact.lastname" 
              ></v-text-field>
            </v-col> 
            <v-col cols="12">
              <v-text-field
                solo 
                type="tel"
                prepend-inner-icon="mdi-phone"
                placeholder="+X (XXX) XX-YY-YY"
                v-model="newContact.phone"
                :error-messages="$v.newContact.phone.$invalid ? 'Phone is required' : ''" 
                @change="$v.newContact.phone.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                solo
                hide-details
                prepend-inner-icon="mdi-mail"
                placeholder="Email"
                v-model="newContact.email"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="dialog = false"
          >Cancel</v-btn>
          <v-spacer></v-spacer> 
          <v-btn
            text
            @click="saveNewContact"
          >
          {{ dialog_mode == 'add' ? 'Add' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbarObject.snackbar"
      :bottom="snackbarObject.y === 'bottom'"
      :color="snackbarObject.color"
      :left="snackbarObject.x === 'left'"
      :multi-line="snackbarObject.mode === 'multi-line'"
      :right="snackbarObject.x === 'right'"
      :timeout="snackbarObject.timeout"
      :top="snackbarObject.y === 'top'"
      :vertical="snackbarObject.mode === 'vertical'"
    >
      {{ snackbarObject.text }}
    </v-snackbar>

  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: { 
    newContact: {
      name: { required },
      phone: { required }
    } 
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      contacts: 'contacts/contacts',
      selectedContacts: 'contacts/selectedContacts'
    })
  },
  data: () => ({
    newContact: {
      id: null,
      icon_color: '#0bc',
      lastname: '',
      name: '',
      phone: '',
      email: '', 
    },
    dialog: false,
    dialog_mode: 'add',
    search: '',
    headers: [
      {
        text: '',
        align: 'start',
        value: 'icon_color',
      },
      {
        text: 'Last name',
        align: ' d-none',
        value: 'lastname',
      },
      {
        text: 'Name', 
        value: 'name',
      },
      { text: 'Phone', value: 'phone' },
      { text: 'Email', value: 'email' },  
    ],
    snackbarObject: { 
      snackbar: false,
      color: '',
      mode: '',
      text: 'Hello',
      timeout: 1000,
      x: null,
      y: 'top',
    },
  }),
  mounted(){
    this.$store.dispatch('contacts/LOAD_USER_CONTACTS', this.$store.getters['user/user'].id_user)
  },
  destroyed(){
    this.$store.dispatch('contacts/CANCEL_SELECTED_CONTACTS')
  },
  methods: {
    getFirstLetter(str_lastname, str_name){
      if(str_lastname !== ''){
        return (str_lastname.substr(0, 1)).toUpperCase()
      }else{
        return str_name !== '' ? (str_name.substr(0, 1)).toUpperCase() : ''
      }
    },
    getRandomColor(){ 
      let random_color = '#'+(Math.random()*0xFFFFFF<<0).toString(16); 
      return random_color
    },
    selectContact(id_contact){
      this.$store.dispatch('contacts/SELECTED_CONTACT_CHECK', id_contact)
    },
    notificate(n_type, n_msg){
      this.snackbarObject.color = n_type
      this.snackbarObject.text = n_msg 
      this.snackbarObject.snackbar = true
    },
    clearNewContactForm(){
      this.newContact = {
        id: null,
        icon_color: '#0bc',
        lastname: '',
        name: '',
        phone: '',
        email: '', 
      }
    },
    addContact(){
      this.dialog = !this.dialog
      this.dialog_mode = 'add'
      this.$store.dispatch('contacts/CANCEL_SELECTED_CONTACTS')
      this.clearNewContactForm() 
    },
    showContact(contact_data){
      if(this.selectedContacts.length === 0){
        this.dialog = !this.dialog
        this.dialog_mode = 'edit'
        this.$store.dispatch('contacts/CANCEL_SELECTED_CONTACTS')
        this.newContact = {
          id: contact_data.id,
          color: contact_data.icon_color,
          lastname: contact_data.lastname,
          name: contact_data.name,
          phone: contact_data.phone,
          email: contact_data.email, 
        }
      } 
    },
    saveNewContact(){
      this.$v.$touch()

      if(!this.$v.$invalid){
        if(this.dialog_mode == 'add'){
          this.$store.dispatch('contacts/SAVE_CONTACT', { 
            icon_color: this.getRandomColor(),
            lastname: this.newContact.lastname,
            name: this.newContact.name,
            phone: this.newContact.phone,
            email: this.newContact.email,
            user_id: this.user.id_user
          })
          .then(() => {
            this.notificate('success', "Contact added")
          })
          .catch(err => {
            this.notificate('error', `Error adding contact! ${err}`)
          })
        }
        if(this.dialog_mode == 'edit'){
          this.$store.dispatch('contacts/SAVE_CONTACT', {
            id: this.newContact.id,
            icon_color: this.newContact.color,
            lastname: this.newContact.lastname,
            name: this.newContact.name,
            phone: this.newContact.phone,
            email: this.newContact.email,
            user_id: this.user.id_user, 
          })
          .then(() => {
            this.notificate('success', "Contact saved")
          })
          .catch(err => {
            this.notificate('error', `Error saving contact! ${err}`)
          })
        } 

        this.dialog = false
        this.clearNewContactForm()
      }
      
    }
  }, 
}
</script>

<style scoped>
</style>