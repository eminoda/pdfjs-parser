<template>
  <div class="page" :page="pageView.id" :style="pageStyle" ref="pageRef">
    <div class="loadingIcon" v-if="pageView.renderingState == 'LOADING'"></div>
    <div style="position: absolute;top: 0;left: 0;color:red;">
      {{ pageView.id }}
    </div>
  </div>
</template>

<script>
import { roundToDivide, approximateFraction, getOutputScale } from "./utils";
export default {
  props: {
    pdfDocument: {
      type: Object,
      default() {
        return {};
      },
    },
    pageView: {
      type: Object,
      default() {
        return {
          viewport: {},
        };
      },
    },
  },
  computed: {
    pageStyle() {
      return {
        width: Math.floor(this.pageView.viewport.width) + "px",
        height: Math.floor(this.pageView.viewport.height) + "px",
      };
    },
  },
  watch: {
    pageView(newVal) {
      console.log(newVal);
    },
  },
  data() {
    return {
      renderTask: null,
    };
  },
  methods: {
    async setPdfPage() {
      const pdfPage = await this.pdfDocument.getPage(this.pageView.id);
      this.pageView.pdfPage = pdfPage;
    },
    draw() {
      if (this.pageView.renderingState != "INIT") {
        return;
      }
      this.pageView.renderingState = "LOADING";
      if (this.renderTask) {
        this.renderTask.cancel();
        this.renderTask = null;
      }
      const viewport = this.pageView.viewport;
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d", {
        alpha: false,
      });
      const outputScale = getOutputScale(ctx);

      const sfx = approximateFraction(outputScale.sx);
      const sfy = approximateFraction(outputScale.sy);
      canvas.width = roundToDivide(viewport.width * outputScale.sx, sfx[0]);
      canvas.height = roundToDivide(viewport.height * outputScale.sy, sfy[0]);
      canvas.style.width = roundToDivide(viewport.width, sfx[1]) + "px";
      canvas.style.height = roundToDivide(viewport.height, sfy[1]) + "px";

      const transform = !outputScale.scaled ? null : [outputScale.sx, 0, 0, outputScale.sy, 0, 0];
      const renderContext = {
        canvasContext: ctx,
        transform,
        viewport: viewport,
        enableWebGL: false,
        renderInteractiveForms: false,
      };
      this.renderTask = this.pageView.pdfPage.render(renderContext);
      const self = this;
      this.renderTask.promise
        .then(() => {
          console.log("draw", this.pageView.id, this.pageView.renderingState);
          this.pageView.renderingState = "FINISHED";
          this.pageView.canvas = canvas;
          self.$refs.pageRef.appendChild(canvas);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  position: relative;
  background: #fff;
  margin: auto;
  margin-bottom: 20px;
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
