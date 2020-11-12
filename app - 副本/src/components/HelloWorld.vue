<template>
  <pdf-container :pdfUrl="pdfUrl" :scale="1" />
</template>

<script>
import PdfContainer from './pdf/pdfContainer'
export default {
  name: 'HelloWorld',
  components: { PdfContainer },
  data() {
    return {
      pdfUrl: ''
    }
  },
  methods: {
  },
  mounted() {
    this.pdfUrl = '/demo.pdf'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
