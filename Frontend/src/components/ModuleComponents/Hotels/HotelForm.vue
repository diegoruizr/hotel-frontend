<template>
  <div class="row">
    <div class="col-md-12 card">
      <div class="card-header">
        <h4 v-if="paramAction === 'edit'" class="title">{{$t('edit_hotel')}}</h4>
        <h4 v-else-if="paramAction === 'view'" class="title">{{$t('view_hotel')}}</h4>
        <h4 v-else class="title">{{$t('hotel_register')}}</h4>
      </div>
      <div class="card-content">
        <fieldset>
          <div class="row">
            <div class="col-sm-4 padding-top-20">
              <label>{{$t('name')}}</label>
              <input type="text"  name="name" v-model="hotel.name" :disabled="paramAction === 'view'" class="form-control" :data-vv-as="'name'" v-validate="modelValidations.name">
              <small class="text-danger" v-show="name.invalid">
                {{ getError('name') }}
              </small>
            </div>
            <div class="col-sm-4 padding-top-20">
              <label>{{$t('nit')}}</label>
              <input type="text" name="nit" @keypress="resetInput" v-model="hotel.nit" :disabled="paramAction == 'view'" @blur="checkNit(hotel.nit)" class="form-control" :data-vv-as="'nit'" v-validate="modelValidations.nit">
              <small class="text-danger" v-show="nit.invalid">
                {{ getError('nit') }}
              </small>
            </div>
            <div class="col-md-4 padding-top-20">
              <label>{{$t('address')}}</label>
              <input type="text" name="address" v-model="hotel.address" :disabled="paramAction === 'view'" class="form-control" :data-vv-as="'address'" v-validate="modelValidations.address">
              <small class="text-danger" v-show="address.invalid">
                {{ getError('address') }}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 padding-top-20">
              <div class="c-boxCompany cities">
                <label>{{$t('city')}}</label>
                <el-select name="city_id"
                            :data-vv-as="'city_id'"
                            v-validate="modelValidations.city_id"
                            size="large"
                            :disabled="paramAction === 'view'"
                            :placeholder="$t('select_option')"
                            v-model="hotel.city_id"
                            >
                  <el-option
                    v-for="option in selects.cities"
                    :value="option.id"
                    :label="option.name"
                    :key="option.id">{{option.name}}
                  </el-option>
                </el-select>
                <small class="text-danger" v-show="city_id.invalid">
                  {{ getError('city_id') }}
                </small>
              </div>
            </div>
            <div class="col-md-3 padding-top-20">
              <label>{{$t('room_number')}}</label>
              <input type="number" name="room_number"  min="1" max="999" v-model="hotel.number_room" :disabled="paramAction === 'view'" class="form-control" :data-vv-as="$t('room_number')" v-validate="modelValidations.room_number">
              <small class="text-danger" v-show="room_number.invalid">
                {{ getError('room_number') }}
              </small>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="card-footer">
        <div class="pull-right">
          <div class="form-group padding-top-20">
            <button type="button" @click="$router.go(-1)" class="btn btn-fill btn-default">{{$t('cancel')}}</button>
            <button v-if="paramAction === 'edit'" type="submit" @click="sendData" class="btn btn-fill btn-default">{{$t('edit')}}</button>
            <button v-else-if="paramAction != 'view'" type="submit" @click="sendData" class="btn btn-fill btn-default">{{$t('create')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapFields} from 'vee-validate'
  import {Select, Option, Upload, Notification} from 'element-ui'
  import {mapGetters} from 'vuex'
  import request from '@/plugins/request'

  export default{
    props: {
      objectID: {
        type: Number
      },
      paramAction: {
        type: String
      },
      multiple: {
        type: Boolean
      }
    },
    components: {
      [Option.name]: Option,
      [Select.name]: Select,
      [Upload.name]: Upload,
      [Notification.name]: Notification
    },
    computed: {
      ...mapGetters(['getAccessToken', 'getIpServer', 'comparePermissions', 'getCompany', 'getCompanyType']),
      ...mapFields(['name', 'nit', 'address', 'room_number', 'city_id'])
    },
    data () {
      return {
        nit_anterior: 0,
        iniNit: true,
        hotel: {
          hotel_id: '',
          city_id: '',
          name: '',
          nit: '',
          address: '',
          number_room: 1
        },
        selects: {
          cities: []
        },
        modelValidations: {
          name: {
            required: true,
            min: 2,
            max: 191
          },
          nit: {
            required: true,
            numeric: true,
            min: 2,
            max: 12
          },
          address: {
            required: true,
            min: 2,
            max: 70
          },
          room_number: {
            required: true,
            numeric: true,
            min: 1
          },
          city_id: {
            required: true
          }
        }
      }
    },
    methods: {
      mensaje (texto, type, tittle) {
        Notification({ title: tittle,
          message: texto,
          type: type
        })
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      resetInput ($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
          $event.preventDefault()
        }
      },
      checkNit (nit) {
        request.post(`api/hotel/unique/nit`, {nit: nit, action: this.paramAction})
          .then(res => {
            if (res.data.status === 501) {
              if ((this.nit_anterior !== 0 && this.nit_anterior !== this.hotel.nit) || (this.nit_anterior === 0)) {
                this.iniNit = false
                this.hotel.nit = ''
                this.mensaje('El hotel ya se encuentra registrado', 'warning', 'Advertencia')
              }
            } else {
              this.iniNit = true
            }
          }).catch(err => {
            console.log(err)
            this.$notify(
              {
                component: {
                  template: `<span>{{$t('hotel_form_error')}}</span>`
                },
                icon: 'ti-check',
                horizontalAlign: 'right',
                verticalAlign: 'top',
                type: 'danger'
              })
          })
      },
      sendData () {
        this.$validator.validateAll()
        .then((result) => {
          if (result && this.iniNit === true) {
            var route = '/create'
            if (this.paramAction === 'edit') {
              route = '/update'
            }
            request.post(`api/hotel${route}`, {hotel: this.hotel})
              .then(res => {
                if (res.data.valid === 0) {
                  this.mensaje('Se ha agregado/modificado correctamente.', 'success', 'Correcto')
                  this.$router.go(-1)
                }
              }).catch(err => {
                console.log(err)
                this.$spinner.close()
                this.mensaje('Se ha producido un error al agregar Hotel.', 'error', 'Error')
              })
          }
          setTimeout(() => {
            this.$spinner.close()
          }, 2000)
        })
      }
    },
    mounted () {
      if (this.paramAction === 'view' || this.paramAction === 'edit') {
        this.$spinner.show()
        request.post(`api/hotel/show`, {id: this.objectID})
          .then(res => {
            this.hotel.hotel_id = res.data.hotel.id
            this.nit_anterior = res.data.hotel.nit
            this.hotel = res.data.hotel
            this.selects.cities = res.data.cities
            this.$validator.reset()
            this.$spinner.close()
          }).catch(err => {
            console.log(err)
            this.$notify({
              component: {
                template: `<span>{{$t('hotel_view_error')}}</span>`
              },
              icon: 'ti-check',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'danger'
            })
            this.$spinner.close()
            this.$router.go(-1)
          })
      }
      request.get(`api/hotel/detail/city`, {})
      .then(res => {
        this.selects.cities = res.data.cities
      }).catch(err => {
        console.log(err)
        this.mensaje('Error cargando las cuidades.', 'error', 'Error')
      })
    }
  }
</script>
<style scoped>
.c-boxCompany{
  display: flex;
  flex-direction: column;
}
.c-select{
border-radius: 10px;
border-style: solid;
border-width: 0.2em;
}
.c-option:checked{
background: linear-gradient(90deg, #231F20, gray, #231F20);
}
@media screen and (max-width: 750px){
  .c-boxCompany{
    padding-left: 2em;
    width: 95%;
  }
}
input[type="file"] {
  margin: 300%;
  display: block !important;
}
.modal-content {
  width: 45%;
}
</style>
<style>
</style>
