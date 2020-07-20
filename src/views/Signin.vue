<template>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="light-blue"
                dark
                flat
              >
                <v-toolbar-title>Sign In</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form> 
                  <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    label="E-mail"
                    required
                    solo
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    :counter="16"
                    label="Password"
                    :type="show_password ? 'text' : 'password'"
                    :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show_password = !show_password"
                    required
                    solo
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="clear">Reset</v-btn>
                <v-btn color="primary" @click="submitLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>


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

          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              text
              v-bind="attrs"
              @click="snackbarObject.snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

      </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, email } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    validations: { 
      email: { required, email },
      password: { required, minLength: minLength(8) },
    },
    mounted(){
      // this.email = 'user1@example.com'
      // this.email = 'user2@example.com'
      // this.password = 'Ab1234567890'
    },
    data: () => ({
      email: '',
      password: '',
      show_password: false,
      snackbarObject: { 
        snackbar: false,
        color: '',
        mode: '',
        text: 'Hello, I\'m a snackbar',
        timeout: 1500,
        x: null,
        y: 'top',
      },
    }),
    computed: {
      ...mapGetters({
        user: 'user/user'
      }),
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Password must be a minimum 8 characters')
        !this.$v.password.required && errors.push('Password is required.')
        return errors
      }
    },
    methods: {
      clear () {
        this.$v.$reset()
        this.email = ''
        this.password = '' 
      },
      submitLogin () {
        this.$v.$touch()

        if(!this.$v.$invalid){
          this.$store.dispatch('user/LOGIN', {
            email: this.email,
            password: this.password
          }).then(() => {
            this.snackbarObject.color = 'success'
            this.snackbarObject.text = 'Login successfully!' 
            this.snackbarObject.snackbar = true
            this.$router.push('/contacts')
          }).catch((err) => {
            this.snackbarObject.color = 'error'
            this.snackbarObject.text = `Login error! ${err}` 
            this.snackbarObject.snackbar = true 
          })

          
        }else{
          this.snackbarObject.color = 'error'
          this.snackbarObject.text = 'Fill all the inputs correctly, please!' 
          this.snackbarObject.snackbar = true
        }
      },
    },
  }
</script>
