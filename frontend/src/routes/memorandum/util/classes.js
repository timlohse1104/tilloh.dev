// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export class FolderClass {
  constructor(id, name) {
    this.id = id;
    this.folderName = name;
    this.links = [];
  }
}

export class HyperlinkClass {
  constructor(id, name, url) {
    this.id = id;
    this.linkName = name;
    this.linkUrl = url;
  }
}
