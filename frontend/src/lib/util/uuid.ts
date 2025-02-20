import type { LinkDto, MemorandumDto } from '$lib/types/memorandum.dto';

const isUUID = (str) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const ensureLinkUUID = (links: LinkDto[]): LinkDto[] => {
  links.forEach((link) => {
    if (!isUUID(link.id)) {
      link.id = crypto.randomUUID();
    }
  });
  return links;
};

export const ensureFolderUUID = (linkPreset: MemorandumDto) => {
  const folders = linkPreset.Folders;
  folders.forEach((folder) => {
    if (!isUUID(folder.id)) {
      folder.id = crypto.randomUUID();
      folder.links = ensureLinkUUID(folder.links);
    }
  });
  return linkPreset;
};
