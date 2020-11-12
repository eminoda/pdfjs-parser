<template>
  <!-- 主容器 -->
  <div id="viewerContainer">
    <pdf-viewer ref="pdfViewerRef" @pdfviewer-loaded="handlePdfViewerLoaded" :pdfDocument="pdfDocument" :scale="scale" />
  </div>
</template>

<script>
import PdfViewer from "./pdfViewer";
import { MAX_SCALE, MIN_SCALE, debounce } from "./utils";
export default {
  components: { PdfViewer },
  props: {
    pdfUrl: {
      type: String,
      default: "",
    },
    scale: {
      type: Number,
      default: 1,
    },
    page: {
      type: Number,
      default: 1,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pdfDocument: null,
      pages: [],
      container: null,
      timer: null,
      debounceScroll: debounce(() => {
        this.$refs.pdfViewerRef.renderHighestPriority();
      }),
    };
  },
  watch: {
    pdfUrl() {
      this.loadPdfDocument();
    },
    scale(newVal) {
      this.setScale(newVal);
    },
    page(newVal) {
      const page = Number(newVal);
      if (!this.pages || this.pages.length == 0) {
        console.log("文档未加载完毕");
      } else if (isNaN(page) || page > this.pages.length) {
        console.log("页码错误");
      } else {
        this.scrollIntoView();
      }
    },
  },
  methods: {
    async loadPdfDocument() {
      this.pdfDocument = await window.pdfjsLib.getDocument({ ...this.options, url: this.pdfUrl }).promise;
      this.$emit("pdf-document", this.pdfDocument);
    },
    scrollIntoView() {
      const element = this.pages[this.page - 1].div;
      if (element) {
        let offsetY = element.offsetTop + element.clientTop;
        this.container.scrollTop = offsetY;
      }
    },
    setScale(scale) {
      // 最值范围
      if (scale > MAX_SCALE) {
        scale = MAX_SCALE;
      }
      if (scale < MIN_SCALE) {
        scale = MIN_SCALE;
      }
      // 更新尺寸
      this.pages.forEach((item) => {
        item.update(scale);
      });
      // 滚动到位
    },
    handlePdfViewerLoaded(pages) {
      this.pages = pages;
      this.$emit("pdf-pages", this.pages);
    },
  },
  mounted() {
    this.container = document.getElementById("viewerContainer");
    this.container.addEventListener("scroll", this.debounceScroll, true);
  },
};
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
}
</style>
