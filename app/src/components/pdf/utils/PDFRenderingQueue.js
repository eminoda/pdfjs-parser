export default class PDFRenderingQueue {
  constructor() {
    this.idleTimeout = null;
    this.pdfViewer = null;
  }

  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }

  renderHighestPriority(currentlyVisiblePages) {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }

    if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
      return;
    }

    if (this.onIdle) {
      this.idleTimeout = setTimeout(this.onIdle.bind(this), 1000);
    }
  }
}
