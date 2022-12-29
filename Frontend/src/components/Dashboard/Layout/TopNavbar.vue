<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-minimize">
        <button class="btn btn-fill btn-icon" @click="minimizeSidebar">
          <i :class="$sidebar.isMinimized ? 'ti-menu-alt' : 'ti-more-alt'"></i>
        </button>
      </div>
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar bar1"></span>
          <span class="icon-bar bar2"></span>
          <span class="icon-bar bar3"></span>
        </button>
        <a class="navbar-brand">{{`${getCompany}/${getProfileName}`}}</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
          <!-- <drop-down tag="li" title="5" icon="ti-bell" :scroll="true" >
            <li><a href="#"><i class="ti-panel"></i>Another notification</a></li>
          </drop-down> -->
          <drop-down tag="li" title="" icon="ti-settings">
            <li><a @click.prevent="closeSesion" href="#"><i class="ti-back-left padding_right"></i>{{$t('close_session')}}</a></li>
            <!-- <li><a @click.prevent="changeCompany" href="#"><i class="ti-split-v padding_right"></i>{{$t('change_company')}}</a></li> -->
          </drop-down>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import { mapMutations, mapGetters } from 'vuex'
  import axios from 'axios'
  import swal from 'sweetalert2'
  export default {
    data () {
      return {
        activeNotifications: false,
        company: ''
      }
    },
    computed: {
      ...mapGetters(['getIpServer', 'getUser', 'getAccessToken', 'getCompany', 'getProfileName'])
    },
    methods: {
      ...mapMutations(['setUser', 'setAccessToken', 'setCompany', 'setCompanyName', 'setPermissions', 'setCompany', 'setProfileName']),
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      minimizeSidebar () {
        this.$sidebar.toggleMinimize()
      },
      closeSesion () {
        let _this = this
        swal({
          title: this.$t('close_session'),
          text: this.$t('close_session_content'),
          type: 'question',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-fill btn-default',
          cancelButtonClass: 'btn btn-fill btn-default',
          confirmButtonText: this.$t('continue'),
          cancelButtonText: this.$t('cancel'),
          buttonsStyling: false
        }).then(function () {
          axios.get(`http://${_this.getIpServer}/api/auth/logout`, {headers: {'Authorization': `Bearer ${_this.getAccessToken}`, 'Accept': 'application/json'}})
            .then(res => {
              _this.setCompany(null)
              _this.setAccessToken(null)
              _this.setUser(null)
              _this.setCompanyName(null)
              _this.setProfileName(null)
              _this.setPermissions(null)
              localStorage.removeItem('user')
              localStorage.removeItem('access_token')
              localStorage.removeItem('company')
              localStorage.removeItem('profile_name')
              localStorage.removeItem('company_name')
              // this.$spinner.close()
              _this.$router.push({ name: 'login' })
              _this.$notify(
                {
                  component: {
                    template: `<span>{{$t('log_out_message')}}</span>`
                  },
                  icon: 'ti-check',
                  horizontalAlign: 'right',
                  verticalAlign: 'top',
                  type: 'success'
                })
            }).catch(err => {
              console.log(err)
              _this.setCompany(null)
              _this.setAccessToken(null)
              _this.setUser(null)
              localStorage.removeItem('user')
              localStorage.removeItem('access_token')
              localStorage.removeItem('company')
              _this.$router.push({ name: 'login' })
              _this.$notify(
                {
                  component: {
                    template: `<span>{{$t('log_out_message')}}</span>`
                  },
                  icon: 'ti-check',
                  horizontalAlign: 'right',
                  verticalAlign: 'top',
                  type: 'success'
                })
            })
        }).catch(function () {
        })
      },
      changeCompany () {
      }
    },
    mounted () {
    }
  }

</script>
<style scope>
  .padding_right {
    padding-right: 1rem;
  }
</style>
