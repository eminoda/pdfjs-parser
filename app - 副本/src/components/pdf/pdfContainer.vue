<template>
  <!-- 主容器 -->
  <!-- 加载 pdf document -->
  <div id="viewerContainer">
    <pdf-viewer :pdfDocument="pdfDocument" :scale="scale" />
  </div>
</template>

<script>
import PdfViewer from './pdfViewer'
export default {
  props: {
    pdfUrl: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  components: { PdfViewer },
  data() {
    return {
      pdfDocument: null
    }
  },
  watch: {
    async pdfUrl() {
      this.pdfDocument = await this.getPdfDocumentProxy()
      console.log(this.pdfDocument)
    }
  },
  methods: {
    getPdfDocumentProxy() {
      return window.pdfjsLib.getDocument({
        url: this.pdfUrl,
        maxImageSize: 1024 * 1024,
        cMapUrl: '/pdfjs-dist/cmaps/',
        cMapPacked: true,
      }).promise;
    }
  }
}
</script>

<style lang="less" scoped>
#viewerContainer {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 32px;
  right: 0;
  bottom: 0;
  left: 0;
  outline: none;
  background: #fff;
}
</style>