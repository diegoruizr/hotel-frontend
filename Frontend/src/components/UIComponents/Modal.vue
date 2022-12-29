<template>
  <div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Modal Header</h4>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true }
    // size: { default: 'modal-lg', type: String },
    // close_header: { default: false, type: Boolean },
    // close_modal: { default: false, type: Boolean }
  },
  methods: {
    close () {
      this.$emit('close')
      if (!this.close_modal) window.$(`#${this.id}`).modal('hide')
    }
  }
}
</script>
<style>
</style>