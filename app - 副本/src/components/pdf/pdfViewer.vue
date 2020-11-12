<template>
  <!-- 页面总视图 -->
  <!-- 解析 page -->
  <div class="pdfViewer" ref="viewerContainer" id="viewer">
    <pdf-page-view
      v-for="(item, index) in pages"
      :key="index"
      :pageView="item"
      ref="pageRef"
    ></pdf-page-view>
  </div>
</template>

<script>
import { CSS_UNITS } from './utils/const'
import { getVisibleElements } from './utils'
import PageViewer from './utils/PageViewer'
import PdfPageView from './pdfPageView'
export default {
  components: { PdfPageView },
  props: {
    pdfDocument: {
      type: Object,
      default() {
        return {}
      }
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  watch: {
    pdfDocument(pdfDocument) {
      this.loadFirstPdfPage(pdfDocument)
    }
  },
  data() {
    return {
      firstPdfPage: null,
      pageCount: 0,
      pages: [],
    }
  },
  methods: {
    async loadFirstPdfPage(pdfDocument) {
      this.pageCount = pdfDocument.numPages;
      this.firstPdfPage = await pdfDocument.getPage(1)
      const viewport = this.firstPdfPage.getViewport({
        scale: this.scale * CSS_UNITS,
      });
      for (let pageNum = 1; pageNum <= this.pageCount; ++pageNum) {
        const pageViewer = new PageViewer({
          container: document.getElementById('viewerContainer'),
          viewport,
          id: pageNum,
          scale: this.scale,
          defaultViewport: viewport.clone(),
          renderingQueue: []
        })
        this.pages.push(pageViewer)
      }
      this.$nextTick(() => {
        this.update()
      })
    },
    update() {
      // 获取可视页面
      this.$refs.pageRef.forEach(pageRef => pageRef.pageView.div = pageRef.$el)
      const container = document.getElementById('viewerContainer')
      const visible = getVisibleElements(container, this.pages, true, false)
      console.log(visible)
      // 刷新视图队列
      // 得到，并渲染最新视图
      // 挂载 loading 状态
      // 绘制
      // 关闭 loading 状态
    }
  }
}
</script>

<style>
</style>