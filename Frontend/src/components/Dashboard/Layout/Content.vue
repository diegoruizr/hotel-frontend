<template>
  <div class="content full-page-background">
    <div class="container-fluid">
      <transition name="fade" mode="out-in">
        <!-- your content here -->
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .15s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }

  .full-page-background{
    position: absolute;
    z-index: 1;
    /*height: 100%;*/
    width: 100%;
    display: block;
    left: 0;
    background-size: cover;
  }
</style>
