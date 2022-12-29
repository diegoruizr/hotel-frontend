<template>
  <div class="row">
    <div class="col-md-12 card">
      <div class="card-header">
        <h4 class="title">{{$t('assing_room_type')}}</h4>
      </div>
      <div class="card-content">
        <fieldset>
          <div class="row">
            <div class="col-md-4 padding-top-20">
              <div class="c-boxCompany">
                <label>{{$t('room_types')}}</label>
                <el-select name="room_type_id"
                            :data-vv-as="'room_type_id'"
                            v-validate="modelValidations.room_type_id"
                            size="large"
                            @change="detailAccommodation(hotel.room_type_id)"
                            :placeholder="$t('select_option')"
                            v-model="hotel.room_type_id"
                            >
                  <el-option
                    v-for="option in selects.roomTypes"
                    :value="option.id"
                    :label="option.name"
                    :key="option.id">{{option.name}}
                  </el-option>
                </el-select>
                <small class="text-danger" v-show="room_type_id.invalid">
                  {{ getError('room_type_id') }}
                </small>
              </div>
            </div>
            <div class="col-md-4 padding-top-20">
              <div class="c-boxCompany">
                <label>{{$t('accommodations')}}</label>
                <el-select name="accommodation_id"
                            :data-vv-as="'accommodation_id'"
                            v-validate="modelValidations.accommodation_id"
                            size="large"
                            :placeholder="$t('select_option')"
                            v-model="hotel.accommodation_id"
                            >
                  <el-option
                    v-for="option in selects.accommodations"
                    :value="option.id"
                    :label="option.name"
                    :key="option.id">{{option.name}}
                  </el-option>
                </el-select>
                <small class="text-danger" v-show="accommodation_id.invalid">
                  {{ getError('accommodation_id') }}
                </small>
              </div>
            </div>
            <div class="col-md-4 padding-top-20">
              <div class="c-boxCompany">
                <label>{{$t('quantity')}}</label>
                <input type="number" min="1" max="999" name="quantity" v-model="hotel.quantity"  class="form-control" :data-vv-as="'quantity'" v-validate="modelValidations.quantity">
                <small class="text-danger" v-show="quantity.invalid">
                  {{ getError('quantity') }}
                </small>
              </div>
            </div>
            <div class="col-md-12 col-sm-12 padding-top-20">
              <div class="col-md-8 form-group text-left">
                <p> <b>Hotel:</b> {{name_hotel}} - Total de habitaciones asignadas: {{count}} de {{number_room}} posibles</p>
              </div>
              <div class="col-md-4 form-group text-right">
                <el-tooltip class="item" effect="dark" :content="'Agregar configuración'" placement="left">
                    <button @click.prevent="addData(hotel)" class="btn btn-fill btn-default">{{$t('add_detail')}}</button>
                </el-tooltip>
              </div>
            </div>
          </div>
          <br>
          <br>
          <el-table
            :data="tableData"
            style="width: 100%"
            max-height="300">
            <el-table-column
              prop="room_type_name"
              label="Tipo de Habitacion"
              width="300">
            </el-table-column>
            <el-table-column
              prop="accommodation_name"
              label="Accomodación"
              width="300">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="Cantidad"
              width="300">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="Operaciones"
              width="150">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">Eliminar</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </div>
      <div class="card-footer">
        <div class="pull-right">
          <div class="form-group padding-top-20">
            <button type="button" @click="$router.go(-1)" class="btn btn-fill btn-default">{{$t('cancel')}}</button>
            <button type="submit" @click="sendData" class="btn btn-fill btn-default">{{$t('assing')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapFields} from 'vee-validate'
  import {Select, Option, Upload, Notification, Table, TableColumn, Button} from 'element-ui'
  import {mapGetters} from 'vuex'
  import request from '@/plugins/request'
  Vue.use(Table)
  Vue.use(TableColumn)

  export default{
    props: {
      objectID: {
        type: Number
      },
      paramAction: {
        type: String
      }
    },
    components: {
      [Option.name]: Option,
      [Select.name]: Select,
      [Upload.name]: Upload,
      [Button.name]: Button,
      [Notification.name]: Notification
    },
    computed: {
      ...mapGetters(['getAccessToken', 'getIpServer', 'comparePermissions', 'getCompany', 'getCompanyType']),
      ...mapFields(['room_type_id', 'accommodation_id', 'quantity'])
    },
    data () {
      return {
        name_hotel: '',
        hotel_id: '',
        count: 0,
        number_room: 0,
        tableData: [],
        hotel: {
          room_type_id: '',
          accommodation_id: '',
          quantity: 1
        },
        selects: {
          accommodations: [],
          roomTypes: []
        },
        modelValidations: {
          quantity: {
            required: true,
            numeric: true,
            min: 1
          },
          accommodation_id: {
            required: true
          },
          room_type_id: {
            required: true
          }
        }
      }
    },
    methods: {
      deleteRow (index, data) {
        this.count = parseInt(this.count) - parseInt(data.quantity)
        this.tableData.splice(index, 1)
      },
      addData (hotel) {
        this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let nameAccomodation = this.selects.accommodations.find(a => a.id === hotel.accommodation_id)
            let nameRoomType = this.selects.roomTypes.find(a => a.id === hotel.room_type_id)
            let formData = {
              accommodation_id: hotel.accommodation_id,
              accommodation_name: nameAccomodation.name,
              room_type_id: hotel.room_type_id,
              room_type_name: nameRoomType.name,
              quantity: hotel.quantity
            }
            let validate = true
            for (let index = 0; index < this.tableData.length; index++) {
              const element = this.tableData[index]
              if (element.accommodation_id === formData.accommodation_id && element.room_type_id === formData.room_type_id) {
                validate = false
                console.log('Es repetida')
                this.mensaje('No debe existir tipos de habitaciones y acomodaciones repetidas para el mismo hotel.', 'warning', 'Advertencia')
                break
              }
            }
            if (validate) {
              console.log('No es repetida')
              console.log(this.count)
              if (parseInt(this.count) < parseInt(this.number_room)) {
                console.log('Es menor')
                let temporal = parseInt(this.count) + parseInt(formData.quantity)
                console.log(temporal)
                if (parseInt(temporal) < parseInt(this.number_room) || parseInt(temporal) === parseInt(this.number_room)) {
                  console.log('Se agrega')
                  this.count = parseInt(this.count) + parseInt(formData.quantity)
                  this.tableData.push(formData)
                  this.hotel = { room_type_id: '', accommodation_id: '', quantity: 1 }
                } else {
                  console.log('Supera la cantidad de habitaciones')
                  this.mensaje('La cantidad de habitaciones configuradas, no deben superar el máximo por hotel', 'warning', 'Advertencia')
                }
              } else {
                console.log('Supera la cantidad de habitaciones')
                this.mensaje('La cantidad de habitaciones configuradas, no deben superar el máximo por hotel', 'warning', 'Advertencia')
              }
            }
          }
        })
      },
      mensaje (texto, type, tittle) {
        Notification({ title: tittle,
          message: texto,
          type: type
        })
      },
      detailAccommodation (roomTypeId) {
        this.hotel.accommodation_id = ''
        request.post(`api/hotel/detail/accommodation`, {id: roomTypeId})
        .then(res => {
          this.selects.accommodations = res.data.accommodations
        }).catch(err => {
          console.log(err)
          this.mensaje('Error cargando los tipos de habitacion.', 'error', 'Error')
        })
      },
      getError (fieldName) {
        return this.errors.first(fieldName)
      },
      sendData () {
        if (Object.entries(this.tableData).length === 0) {
          this.mensaje('No se han asignado habitaciones.', 'warning', 'Advertencia')
        } else {
          let objectSend = {
            'tableData': this.tableData,
            'hotel_id': this.objectID
          }
          request.post(`api/hotel/assing`, {object: objectSend})
          .then(res => {
            this.mensaje('Se asignaron habitaciones', 'success', 'Correcto')
            this.$router.go(-1)
          }).catch(err => {
            console.log(err)
            this.$spinner.close()
            this.mensaje('Se ha producido un error al asignar habitaciones.', 'error', 'Error')
          })
        }
      }
    },
    mounted () {
      request.post(`api/hotel/detail/type`, {id: this.objectID})
      .then(res => {
        this.number_room = res.data.number_room
        this.name_hotel = res.data.name_hotel
        this.selects.roomTypes = res.data.room_types
      }).catch(err => {
        console.log(err)
        this.mensaje('Error cargando los tipos de habitacion.', 'error', 'Error')
      })
      request.post(`api/hotel/detail/assing`, {id: this.objectID})
      .then(res => {
        this.count = res.data.total
        this.tableData = res.data.tableData
      }).catch(err => {
        console.log(err)
        this.mensaje('Error cargando los las asignaciones del hotel.', 'error', 'Error')
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
