// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export class Folder {
  constructor(id, name) {
    this.id = id;
    this.folderName = name;
    this.links = [];
  }
}
