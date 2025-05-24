export class LinkDto {
  id: string;
  linkName: string;
  linkUrl: string;
}

class FolderBackgroundDto {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class FolderDto {
  id: string;
  folderName: string;
  links: LinkDto[];
  backgroundColor: FolderBackgroundDto;
  customBackgroundColor: FolderBackgroundDto;
}

export class MemorandumDto {
  Folders: FolderDto[];
}

export type Order = {
  id: string;
  name: string;
  icon: unknown;
};
