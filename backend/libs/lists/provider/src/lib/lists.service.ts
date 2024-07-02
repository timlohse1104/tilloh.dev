import { Injectable } from '@nestjs/common';

@Injectable()
export class ListsService {
  getAllLists(): any[] {
    return [];
  }

  getListById(id: number): any {
    return null;
  }

  createList(item: any): any {}

  updateList(id: number, item: any): any {
    return null;
  }

  deleteList(id: number): void {}
}
