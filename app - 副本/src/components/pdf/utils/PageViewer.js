export default class PageViewer {
  constructor(options) {
    this.container = options.container;
    this.div = options.div;
    this.id = options.id;
    this.scale = options.scale;
    this.viewport = options.viewport;
    this.defaultViewport = options.defaultViewport;
    this.renderingQueue = options.renderingQueue;
  }
  set div($el) {
    this._div = $el;
  }
  get div() {
    return this._div;
  }
}
