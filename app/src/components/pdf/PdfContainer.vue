<template>
  <div>
    <div ref="printContainer">
      <div v-for="(item, index) in this.pages" :key="index">
        <page-viewer ref="pageViewer" :renderPage="item" />
      </div>
    </div>
  </div>
</template>

<script>

import PageViewer from './PageViewer'
import PDFDocument from './Document'
import { debounce } from './util'
export default {
  components: { PageViewer },
  data() {
    return {
      pdfDocument: null,
      pageCount: 0,
      pages: [],
    }
  },
  methods: {
    handleScroll() {
      for (let i = 0; i < this.pages.length; i++) {
        this.$refs.pageViewer[i].render()
      }
    },
    async init() {
      // 解析 pdf 文件，获取 pdf 文档对象（自定义）
      this.pdfDocument = await new PDFDocument().init('/demo.pdf')
      // 每页展示队列
      this.pages = this.pdfDocument.pages
      // 下轮循环，直接渲染到页面
      // this.$nextTick(this.renderPage)
    }
  },
  mounted() {
    this.init()
    const debounceFn = debounce(this.handleScroll)
    window.addEventListener('scroll', () => {
      debounceFn()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
