class PageViewer {
  constructor(pageNumber, pdfProxy, firstPageProxy) {
    this.page = pageNumber;
    this.pdfProxy = pdfProxy;
    this.firstPageProxy = firstPageProxy;
    this.pageProxy = null;
    this.canvas = document.createElement('canvas');
  }

  getPageSize(scale = 1) {
    const size = (this.pageProxy || this.firstPageProxy).getViewport(scale);
    return {
      width: size.width,
      height: size.height,
    };
  }

  render(scale) {
    // 获取对应页面的 pageProxy
    return this.pdfProxy.getPage(this.page).then((pageProxy) => {
      this.pageProxy = pageProxy;
      return this.drawPage(scale);
    });
  }

  // 绘制页面
  drawPage(scale = 1) {
    // 构建 canvas 模块
    let viewport = this.pageProxy.getViewport(scale);
    const context = this.canvas.getContext('2d');

    // TODO: 根据 scale，适配转换 canvas
    const { width, height } = this.getPageSize(scale);
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

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
