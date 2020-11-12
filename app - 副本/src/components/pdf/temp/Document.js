import PageView from './PageView';

class PDFDocument {
  constructor() {
    this.src = '';
    this.pdfDocumentProxy = null;
    this.firstPageProxy = null;
    this.pageCount = 0;
    this.pages = [];
    this.pagesMap = {};
  }
  async init(src) {
    this.src = src;
    const loadingTask = window.pdfjsLib.getDocument({
      url: this.src,
      maxImageSize: 1024 * 1024,
      cMapUrl: '/pdfjs-dist/cmaps/',
      cMapPacked: true,
    });
    this.pdfDocumentProxy = await loadingTask.promise;
    this.firstPageProxy = await this.pdfDocumentProxy.getPage(1);
    this.pageCount = this.pdfDocumentProxy.numPages;

    for (let i = 1; i <= this.pageCount; i++) {
      const page = new PageView(i, this.pdfDocumentProxy, this.firstPageProxy);
      this.pages.push(page);
      this.pagesMap[i] = page;
    }

    return this;
  }
}

export default PDFDocument;
