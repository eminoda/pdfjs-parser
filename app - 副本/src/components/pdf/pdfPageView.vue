<template>
  <div class="page" :style="pageStyle"></div>
</template>

<script>
export default {
  props: {
    pageView: {
      type: Object,
      default() {
        return {
          viewport: {}
        }
      }
    }
  },
  computed: {
    pageStyle() {
      return {
        width: Math.floor(this.pageView.viewport.width) + 'px',
        height: Math.floor(this.pageView.viewport.height) + 'px'
      }
    }
  }

}
</script>

<style>
.page {
  position: relative;
}
</style>