// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export class RGBBackgroundClass {
  constructor(input) {
    this.r = input.r;
    this.g = input.g;
    this.b = input.b;
    this.a = input.a;
  }

  getRGBA() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  getRGBAValues() {
    return [this.r, this.g, this.b, this.a];
  }
}

export class FolderClass {
  constructor(id, name) {
    this.id = id;
    this.folderName = name;
    this.links = [];
    this.backgroundColor = {};
  }
}

export class HyperlinkClass {
  constructor(id, name, url) {
    this.id = id;
    this.linkName = name;
    this.linkUrl = url;
  }
}
