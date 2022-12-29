<template>
  <div>
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color=""
           data-image="static/img/background/background-2.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                <form method="#" action="#">
                  <div class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 v-if="login === 0" class="card-title">{{$t('login_tittle')}}</h3>
                      <h3 v-else-if="login === 1" class="card-title">{{$t('recovery_password_tittle')}}</h3>
                      <h3 v-else-if="login === 2" class="card-title">{{$t('select_company_tittle')}}</h3>
                      <h3 v-else class="card-title">{{$t('reset_password_tittle')}}</h3>
                    </div>
                    <div class="card-content">
                      <div class="form-group" v-show="login !== 2">
                        <label>{{$t('email_adress')}}</label>
                        <input type="email" name="email" :placeholder="$t('enter_email')" :data-vv-as="$t('email_adress')" v-validate="modelValidations.email" v-model="model.email" class="form-control input-no-border" :readonly="login === 3">
                        <small class="text-danger" v-show="email.invalid">
                          {{ getError('email') }}
                        </small>
                        <span v-if="login === 1" class="help-block">
                          {{ $t('recovery_message_help') }}
                        </span>
                      </div>
                      <div class="form-group" v-show="login === 0">
                        <label>{{$t('password')}}</label>
                        <input type="password" name="password" :placeholder="$t('enter_password')" :data-vv-as="$t('password')" v-validate="modelValidations.password" v-model="model.password" class="form-control input-no-border">
                        <small class="text-danger" v-show="password.invalid">
                          {{ getError('password') }}
                        </small>
                      </div>
                    </div>
                    <div class="card-footer text-center">
                      <button  v-if="login != 2" @click.prevent="validate" class="btn btn-fill btn-wd ">
                        <template v-if="login === 0">{{$t('login')}}</template>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <footer class="footer footer-transparent">
          <div class="container">
            <div class="copyright">
              <a href="" target="_blank">Hoteles Decameron</a>.
            </div>
          </div>
        </footer>
        <div class="full-page-background" style="background-image: url(static/img/fondo.jpg) "></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import {mapFields} from 'vee-validate'
import axios from 'axios'
import request from '@/plugins/request'
import {Select, Option} from 'element-ui'
export default{
  computed: {
    ...mapFields(['password', 'email', 'new_password', 'repeat_password']),
    ...mapGetters(['getIpServer', 'getCompanyId', 'getEncrypt'])
  },
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data () {
    return {
      login: 0,
      companies: [],
      companySelect: [],
      origin: '',
      model: {
        email: '',
        password: '',
        new_password: '',
        repeat_password: ''
      },
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        },
        new_password: {
          required: true
        },
        repeat_password: {
          required: true,
          confirmed: 'new_password'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setUser', 'setCompany', 'setCompanyId', 'setAccessToken', 'setProfile', 'setCompanyName', 'setProfileName', 'encryptData', 'checkAllUser', 'setExpiresAt']),
    getError (fieldName) {
      return this.errors.first(fieldName)
    },
    validate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            if (this.login === 0) {
              this.$spinner.show()
              // encrypta los datos antes de ser enviados
              this.checkAllUser()
              this.encryptData({email: this.model.email, password: this.model.password, company: ''})
              axios.post(`http://${this.getIpServer}/api/auth/login`, {encrypt: this.$store.state.encrypt})
                .then(res => {
                  this.$spinner.close()
                  this.companies = res.data.companies
                  if (this.companies.length > 1) {
                    this.login = 2
                  } else {
                    this.setUser(res.data.user_id)
                    this.setAccessToken(res.data.access_token)
                    this.setCompany(this.companies[0].name)
                    this.setProfile(res.data.profile_id)
                    this.setCompanyId(this.companies[0].id)
                    this.setProfileName(res.data.profile_name)
                    // this.setExpiresAt(res.data.expires_at)
                    localStorage.setItem('user', res.data.user_id)
                    localStorage.setItem('access_token', res.data.access_token)
                    localStorage.setItem('company', this.companies[0].db_name)
                    localStorage.setItem('company', this.companies[0].name)
                    localStorage.setItem('profile', res.data.profile_id)
                    localStorage.setItem('company_id', this.companies[0].id)
                    localStorage.setItem('profile_name', res.data.profile_name)
                    localStorage.setItem('expires_at', res.data.expires_at)
                    this.$router.push({ name: 'home' })
                    this.$notify(
                      {
                        component: {
                          template: `<span>{{$t('wellcome_message')}}</span>`
                        },
                        icon: 'ti-check',
                        horizontalAlign: 'right',
                        verticalAlign: 'top',
                        type: 'success'
                      })
                  }
                }).catch(err => {
                  this.$spinner.close()
                  console.log(err)
                  this.$notify(
                    {
                      component: {
                        template: `<span>{{$t('error_credentials')}}</span>`
                      },
                      icon: 'ti-close',
                      horizontalAlign: 'right',
                      verticalAlign: 'top',
                      type: 'danger'
                    })
                  this.$validator.reset()
                  this.model.password = ''
                })
            }
          }
        })
    },
    findUser () {
      request.post(`api/auth/mail`, {token: this.$route.params.token})
        .then(res => {
          this.model.email = res.data
        }).catch(err => {
          this.$spinner.close()
          console.log(err)
        })
    }
  },
  mounted () {
    if (this.$route.params.token) {
      this.login = 3
      this.model.password = 'password'
      this.findUser()
    }
  }
}
</script>
<style scoped>
  .btn-full-width {
    width: 100%
  }
  .width {
    width: 22em;
  }
</style>
