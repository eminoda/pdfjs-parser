<template>
  <div class="pageViewer">
    <div class="page-canvas" ref="canvasRef"></div>
  </div>
</template>

<script>
import PageViewer from './PageViewer'
export default {
  props: {
    page: Number,
    renderPage: PageViewer
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
    this.$refs.canvasRef.appendChild(this.renderPage.canvas)
  }
}
</script>

<style>
</style>