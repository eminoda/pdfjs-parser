<template>
  <div class="page-viewer" :style="pageSizeStyle">
    <div class="loadingIcon" v-if="status == 'loading'"></div>
    <div class="page-canvas" ref="canvasRef"></div>
  </div>
</template>

<script>
import PageViewer from './PageViewer'
export default {
  props: {
    page: Number,
    renderPage: PageViewer,
    scale: Number
  },
  data() {
    return {
      status: 'init',
      rect: {}
    }
  },
  watch: {
    status(oldVal, newVal) {
      console.log(oldVal, newVal)
    }
  },
  computed: {
    pageSizeStyle() {
      const { width, height } = this.renderPage.getPageSize()
      return {
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  methods: {
    render() {
      if (this.status == 'init') {
        this.rect = this.$refs.canvasRef.getBoundingClientRect()
        // 出现在可视区
        if (this.rect.top < window.innerHeight) {
          this.status = 'loading'
          this.renderingView()
        }
      }
    },
    renderingView() {
      this.renderPage
        .render()
        .then(() => {
          this.status = 'rendered'
          this.$refs.canvasRef.appendChild(this.renderPage.canvas)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.render()
  }
}
</script>

<style lang="less" scoped>
.page-viewer {
  border: 1px solid #666;
  margin-bottom: 20px;
  position: relative;
  .loadingIcon {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: url(../../assets/loading-icon.gif) center no-repeat;
  }
}
</style>
