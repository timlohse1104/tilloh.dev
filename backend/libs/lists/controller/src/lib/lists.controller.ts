import { ListsService } from '@backend/lists-provider';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  getLists(): ListsDto[] {
    return this.listsService.getAllLists();
  }

  @Get(':id')
  getList(id: string) {
    return this.listsService.getListById(id);
  }

  @Post()
  createList(newList: ListsDto) {
    return this.listsService.createList(newList);
  }

  @Put(':id')
  updateList(id: string, @Body() updatedList: ListsDto) {
    return this.listsService.updateList(id, updatedList);
  }

  @Delete(':id')
  deleteList(id: string): void {
    this.listsService.deleteList(id);
  }
}
