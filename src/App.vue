<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list v-if="user.hasOwnProperty('token')">
        <v-list-item link>
          <v-list-item-avatar color="light-blue"> 
            <v-icon class="white--text">mdi-account-circle</v-icon> 
          </v-list-item-avatar>
          <v-list-item-title v-text="user.email"></v-list-item-title>
        </v-list-item>
      </v-list>


      <v-list dense>
        <template v-for="item in items">
          <v-list-item
            v-if="item.requiresAuth ? isLogged : !item.requiresAuth"
            :key="item.text"
            :to="item.routerUri"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :color="selectedContacts.length ? 'light-blue darken-4' : 'light-blue'" 
      app 
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!selectedContacts.length"></v-app-bar-nav-icon>
      <v-btn
        v-else
        icon
        @click="$store.dispatch('contacts/CANCEL_SELECTED_CONTACTS')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        {{ selectedContacts.length ? `${selectedContacts.length} selected` : 'Contacts App' }}
      </v-toolbar-title>

      <v-spacer></v-spacer>   

      <v-scale-transition>
        <v-btn
          v-if="selectedContacts.length"
          key="delete"
          icon
          @click="deleteContactsDialog = true"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-scale-transition>

      <v-btn color="light-blue darken-4" to="/signin" v-if="!user.hasOwnProperty('token') ? !selectedContacts.length : false">
        <v-icon>mdi-login</v-icon> Sign In
      </v-btn>
      <v-btn color="red darken-1" @click="logoutUser" v-if="user.hasOwnProperty('token') ? !selectedContacts.length : false">
        <v-icon>mdi-logout</v-icon> Logout
      </v-btn>
    </v-app-bar>


    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-main>



    <v-dialog
      v-model="deleteContactsDialog"
      width="800px"
    >
      <v-card>
        <v-card-title class="red darken-1 white--text">
          Are you sure ?
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col
              class="align-center justify-space-between"
              cols="12"
            >
              <v-row
                align="center"
                class="mr-0"
              >
              It will be deleted <span class="font-weight-bold pl-1"> {{ selectedContacts.length }} contacts</span>
              </v-row>
            </v-col>

          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="deleteContactsDialog = false"
          >Cancel</v-btn>
          <v-spacer></v-spacer> 
          <v-btn
            text
            @click="confirmDelete"
          >Delete</v-btn>
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

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      isLogged: 'user/isLogged',
      user: 'user/user',
      selectedContacts: 'contacts/selectedContacts'
    })
  },
  props: {
    source: String,
  },
  data: () => ({
    snackbarObject: { 
      snackbar: false,
      color: '',
      mode: '',
      text: 'Hello',
      timeout: 1000,
      x: null,
      y: 'top',
    },
    deleteContactsDialog: false,
    drawer: null,
    items: [
      { icon: 'mdi-home', text: 'Home', routerUri: '/', requiresAuth: false },
      { icon: 'mdi-contacts', text: 'Contacts', routerUri: '/contacts', requiresAuth: true }, 
    ]
  }),
  methods: {
    notificate(n_type, n_msg){
      this.snackbarObject.color = n_type
      this.snackbarObject.text = n_msg 
      this.snackbarObject.snackbar = true
    },
    logoutUser(){
      this.$store.dispatch('user/LOGOUT').then(() => {
        this.$router.push('/signin')
      })
    },
    confirmDelete(){
      this.$store.dispatch('contacts/DELETE_CONTACTS', this.user.id_user)
      .then(() => {
        this.notificate('success', "Deleted")
      })
      .catch(err => {
        this.notificate('success', `Error deleting! ${err}`)
      })
      this.deleteContactsDialog = false
    }
  },
  created(){
    this.$store.dispatch('user/CHECK_USER_BY_TOKEN')
  }
};
</script>
