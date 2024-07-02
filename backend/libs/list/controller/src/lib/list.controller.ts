import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  getLists(): ListDto[] {
    return this.listService.getAllLists();
  }

  @Get(':id')
  getList(id: string) {
    return this.listService.getListById(id);
  }

  @Post()
  createList(newList: ListDto) {
    return this.listService.createList(newList);
  }

  @Put(':id')
  updateList(id: string, @Body() updatedList: ListDto) {
    return this.listService.updateList(id, updatedList);
  }

  @Delete(':id')
  deleteList(id: string): void {
    this.listService.deleteList(id);
  }
}
