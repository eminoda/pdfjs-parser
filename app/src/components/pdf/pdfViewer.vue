<template>
  <!-- 页面总视图 -->
  <div class="pdfViewer" ref="viewerContainer" id="viewer">
    <pdf-page-view v-for="(item, index) in pages" :key="index" :pdfDocument="pdfDocument" :pageView="item" ref="pageRef"></pdf-page-view>
  </div>
</template>

<script>
import { CSS_UNITS } from "./utils";
import { getVisibleElements } from "./utils";
import PageViewer from "./utils/PageViewer";
import PdfPageView from "./pdfPageView";
import PDFRenderingQueue from "./utils/PDFRenderingQueue";
export default {
  components: { PdfPageView },
  props: {
    pdfDocument: {
      type: Object,
      default() {
        return {};
      },
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    pdfDocument(pdfDocument) {
      this.loadFirstPdfPage(pdfDocument);
    },
  },
  data() {
    return {
      firstPdfPage: null,
      pageCount: 0,
      pages: [],
      renderingQueue: null,
      idleTimeout: null,
      viewport: null,
    };
  },
  methods: {
    async loadFirstPdfPage(pdfDocument) {
      this.pageCount = pdfDocument.numPages;
      this.$emit("page-count", this.pageCount);

      this.firstPdfPage = await pdfDocument.getPage(1);
      this.viewport = this.firstPdfPage.getViewport({
        scale: this.scale * CSS_UNITS,
      });
      this.renderingQueue = new PDFRenderingQueue({});
      for (let pageNum = 1; pageNum <= this.pageCount; ++pageNum) {
        const pageViewer = new PageViewer({
          container: this._getContainer(),
          viewport: this.viewport,
          id: pageNum,
          scale: this.scale,
          defaultViewport: this.viewport.clone(),
          renderingQueue: [],
        });
        this.pages.push(pageViewer);
      }
      this.$nextTick(() => {
        this.$emit("pdfviewer-loaded", this.pages);
        this.update(this.scale);
      });
    },
    _getContainer() {
      return document.getElementById("viewerContainer");
    },
    update() {
      // 获取可视页面
      this.$refs.pageRef.forEach((pageRef) => (pageRef.pageView.div = pageRef.$el));
      const visible = getVisibleElements(this._getContainer(), this.pages, true, false);
      // 刷新视图队列
      const { views } = visible;
      if (views.length === 0) {
        return;
      }
      // TODO: 添加缓存列表
      // const DEFAULT_CACHE_SIZE = 1; //默认渲染
      // const newCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * numVisiblePages + 1);
      // this._buffer.resize(newCacheSize, visiblePages);

      // 得到，并渲染最新视图
      this.renderHighestPriority(visible);
    },
    renderHighestPriority(currentlyVisiblePages) {
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }

      if (this.forceRendering(currentlyVisiblePages)) {
        return;
      }

      if (this.onIdle) {
        this.idleTimeout = setTimeout(this.onIdle.bind(this), 1000);
      }
    },
    // 渲染页面
    forceRendering(visible) {
      visible = visible || getVisibleElements(this._getContainer(), this.pages, true, false);
      // TODO: 这里可以对 pdfPage 添加变量缓存
      const pageView = this.getHighestPriority(visible, this.pages, true);
      if (pageView) {
        const pdfPageViewRef = this.$refs.pageRef[pageView.id - 1];
        pdfPageViewRef.setPdfPage().then(() => {
          pdfPageViewRef.draw();
        });
        return true;
      }
      return false;
    },
    // 获取需要渲染页面
    getHighestPriority(visible, views, scrolledDown) {
      const visibleViews = visible.views;
      const numVisible = visibleViews.length;

      if (numVisible === 0) {
        return null;
      }
      for (let i = 0; i < numVisible; ++i) {
        const view = visibleViews[i].view;
        if (!this.isViewFinished(view)) {
          return view;
        }
      }
      if (scrolledDown) {
        const nextPageIndex = visible.last.id;
        if (views[nextPageIndex] && !this.isViewFinished(views[nextPageIndex])) {
          return views[nextPageIndex];
        }
      }
      return null;
    },
    isViewFinished(view) {
      return view.renderingState === "FINISHED";
    },
  },
};
</script>

<style></style>
