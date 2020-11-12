import { CSS_UNITS } from "./index";

export default class PageViewer {
  constructor(options) {
    this.container = options.container;
    this.div = options.div;
    this.id = options.id;
    this.scale = options.scale;
    this.viewport = options.viewport;
    this.defaultViewport = options.defaultViewport;
    this.renderingQueue = options.renderingQueue;
    this.renderingState = "";
    this.renderingState = "INIT";
  }
  set div($el) {
    this._div = $el;
  }
  get div() {
    return this._div;
  }

  update(scale) {
    this.scale = scale;
    this.viewport = this.viewport.clone({
      scale: this.scale * CSS_UNITS,
    });
    this.cssTransform(this.canvas);
  }

  cssTransform(target) {
    if (target) {
      const width = this.viewport.width;
      const height = this.viewport.height;
      const div = this.div;
      target.style.width = target.parentNode.style.width = div.style.width = Math.floor(width) + "px";
      target.style.height = target.parentNode.style.height = div.style.height = Math.floor(height) + "px";
    }
  }

  forceRendering() {
    console.log("forceRendering");
  }
}
