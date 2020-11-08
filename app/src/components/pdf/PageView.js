class PageViewer {
  constructor(pageNumber, pdfProxy, firstPageProxy) {
    this.page = pageNumber;
    this.pdfProxy = pdfProxy;
    this.firstPageProxy = firstPageProxy;
    this.pageProxy = null;
    this.canvas = document.createElement('canvas');
  }

  render(scale) {
    // 获取对应页面的 pageProxy
    return this.pdfProxy.getPage(this.page).then((pageProxy) => {
      this.pageProxy = pageProxy;
      return this.drawPage(scale);
    });
  }

  // 绘制页面
  drawPage() {
    // 构建 canvas 模块
    let viewport = this.pageProxy.getViewport({ scale: 1 });
    const context = this.canvas.getContext('2d');

    // TODO: 根据 scale，适配转换 canvas
    this.canvas.style.width = '375px';
    this.canvas.style.height = '222px';

    // 准备渲染参数，渲染页面
    const renderContext = {
      canvasContext: context,
      viewport,
      enableWebGL: true,
      transform: null,
      renderInteractiveForms: false,
    };

    return this.pageProxy.render(renderContext);
  }
}

export default PageViewer;
