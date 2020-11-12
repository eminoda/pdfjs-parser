<template>
  <div>
    <div>
      <input type="text" v-model="page" />
      <button @click="zoomIn">缩小</button>
      <button @click="zoomOut">放大</button>
    </div>
    <pdf-container :pdfUrl="pdfUrl" :scale="scale" :page="Number(page)" :options="options" />
  </div>
</template>

<script>
import PdfContainer from "./pdf/pdfContainer";
export default {
  name: "HelloWorld",
  components: { PdfContainer },
  data() {
    return {
      pdfUrl: "",
      page: 1,
      scale: 1,
      options: {
        maxImageSize: 1024 * 1024,
        cMapUrl: "/pdfjs-dist/cmaps/",
        cMapPacked: true,
      },
    };
  },
  methods: {
    zoomIn() {
      this.scale = (this.scale * 100 - 10) / 100;
    },
    zoomOut() {
      this.scale = (this.scale * 100 + 10) / 100;
    },
  },
  mounted() {
    this.pdfUrl = "/demo.pdf";
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
