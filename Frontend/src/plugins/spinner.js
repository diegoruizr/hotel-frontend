import swal from 'sweetalert2'
const spinner = {}
spinner.install = function (Vue, options) {
  const object = {
    show (message = options.i18n.t('loading')) {
      swal({
        allowOutsideClick: false,
        title: message
      })
      swal.showLoading()
    },
    close () {
      swal.close()
    }
  }
  Vue.prototype.$spinner = object
}

export default spinner
