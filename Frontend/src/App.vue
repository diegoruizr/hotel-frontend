<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">

    </notifications>
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  // Loading some plugin css asynchronously
  import('sweetalert2/dist/sweetalert2.css')
  import('vue-notifyjs/themes/default.css')
  export default {}
</script>
<style lang="scss">
  .notifications.vue-notifyjs {
    .notification-list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .notification-list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .notification-list-enter-active, .notification-list-leave-active {
      transition: opacity 0.4s;
    }
    .notification-list-enter, .notification-list-leave-to /* .list-leave-active for <2.1.8 */
    {
      opacity: 0;
    }
  }
/* custom */
.padding-top-20 {
  margin-top: 20px;
}
.display-block {
  display: block;
}
.el-select .el-input {
  &:hover {
    .el-input__icon,
    input {
      &::placeholder {
        color: black;
      }
      color: black;
    }
  }
}
.el-select .el-tag {
  color:white;
}
.hover-black {
  &:hover {
    .el-input__icon,
    input {
      &::placeholder {
        color: black;
      }
      color: black;
    }
  }
}
#text-change.hover-black {
  color:white;
}
.text-change{
  color: white;
}

.tooltip-arrow {
    display: block !important;
    opacity: 1 !important;
}
.modal-backdrop {
  z-index: 0 !important;
}
.modal-content {
  width: 53%;
}
.modal {
  width: 128%;
}
.select2-container .select2-selection--single {
  height: 2.8em !important;
  padding: 5px;
  width: 21.8em;
  display: flex;
  flex-direction:row-reverse;
}
.select2-selection__arrow {
  height: 2.8em !important;
  right: auto !important;
}
.select2-search__field {
  height: 2.8em !important;
  width: 21em !important;
}
.select2-results {
  width: 21.8em !important;
  padding: 5px;
}
.select2-dropdown {
width: 21.8em !important;
}
.select2-selection__rendered {
width: 21.8em !important;
}
input[type="file"] {
  display: none !important;
  margin: 300%;
}
input, input:hover {
  color: black !important;
}

.el-tag.el-tag--info {
  color: #FFF !important;
}

</style>
