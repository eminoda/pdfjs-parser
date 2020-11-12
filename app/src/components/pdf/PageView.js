import { getOutputScale, approximateFraction, roundToDivide } from './util'

class PageViewer {
  constructor(pageNumber, pdfProxy, firstPageProxy) {
    this.page = pageNumber
    this.pdfProxy = pdfProxy
    this.firstPageProxy = firstPageProxy
    this.pageProxy = null
    this.canvas = document.createElement('canvas')
  }

  getPageSize(scale = 96.0 / 72.0) {
    const size = (this.pageProxy || this.firstPageProxy).getViewport({ scale })
    return {
      width: size.width,
      height: size.height
    }
  }

  render(scale) {
    // 获取对应页面的 pageProxy
    return this.pdfProxy.getPage(this.page).then(pageProxy => {
      this.pageProxy = pageProxy
      return this.drawPage(scale)
    })
  }

  // 绘制页面
  drawPage(scale = 96.0 / 72.0) {
    // 构建 canvas 模块
    let viewport = this.pageProxy.getViewport({ scale })
    const context = this.canvas.getContext('2d')

    // TODO: 根据 scale，适配转换 canvas

    const outputScale = getOutputScale()
    const sfx = approximateFraction(outputScale.sx)
    const sfy = approximateFraction(outputScale.sy)

    this.canvas.width = roundToDivide(viewport.width * outputScale.sx, sfx[0])
    this.canvas.height = roundToDivide(viewport.height * outputScale.sy, sfy[0])

    this.canvas.style.width = roundToDivide(viewport.width, sfx[1]) + 'px'
    this.canvas.style.height = roundToDivide(viewport.height, sfy[1]) + 'px'

    // 准备渲染参数，渲染页面
    const renderContext = {
      canvasContext: context,
      viewport,
      enableWebGL: true,
      transform: !outputScale.scaled ? null : [outputScale.sx, 0, 0, outputScale.sy, 0, 0],
      renderInteractiveForms: false
    }

    return this.pageProxy.render(renderContext).promise
  }
}

export default PageViewer
