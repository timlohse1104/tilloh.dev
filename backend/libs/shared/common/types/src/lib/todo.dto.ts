import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class HistoryEntryDto {
  @ApiProperty({ description: 'History entry title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'History entry category' })
  @IsNotEmpty()
  @IsString()
  category: string;
}

export class TodoItemDto {
  @ApiProperty({ description: 'Todo item ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Todo item title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Todo item completion status', required: false })
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @ApiProperty({ description: 'Todo item category', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}

export class SharedTodoListDto {
  @ApiProperty({ description: 'Shared todo list ID' })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({ description: 'Shared todo list name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Shared todo list emoji' })
  @IsNotEmpty()
  @IsString()
  emoji: string;

  @ApiProperty({ description: 'Todo items in the list', type: [TodoItemDto] })
  @IsArray()
  todos: TodoItemDto[];

  @ApiProperty({ description: 'History of changes', type: [HistoryEntryDto], required: false })
  @IsOptional()
  @IsArray()
  history?: HistoryEntryDto[];

  @ApiProperty({ description: 'Categories used in todos', type: [String], required: false })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({ description: 'Version for optimistic locking' })
  @IsNumber()
  version: number;

  @ApiProperty({ description: 'Creation date', required: false })
  @IsOptional()
  created: Date;

  @ApiProperty({ description: 'Update date', required: false })
  @IsOptional()
  updated: Date;
}

export class GetSharedTodoListsOutputDto extends SharedTodoListDto {}

export class GetSharedTodoListInputDto {
  @ApiProperty({ description: 'Shared todo list ID' })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class GetSharedTodoListOutputDto extends SharedTodoListDto {}

export class CreateSharedTodoListInputDto {
  @ApiProperty({ description: 'Shared todo list name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Shared todo list emoji' })
  @IsNotEmpty()
  @IsString()
  emoji: string;
}

export class CreateSharedTodoListOutputDto extends SharedTodoListDto {}

export class UpdateSharedTodoListInputDto {
  @ApiProperty({ description: 'Shared todo list ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Shared todo list name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Shared todo list emoji' })
  @IsNotEmpty()
  @IsString()
  emoji: string;

  @ApiProperty({ description: 'Todo items in the list', type: [TodoItemDto] })
  @IsArray()
  todos: TodoItemDto[];

  @ApiProperty({ description: 'History of todo entries', type: [HistoryEntryDto], required: false })
  @IsOptional()
  @IsArray()
  history?: HistoryEntryDto[];

  @ApiProperty({ description: 'Categories used in todos', type: [String], required: false })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({ description: 'Current version for optimistic locking' })
  @IsNumber()
  version: number;
}

export class UpdateSharedTodoListOutputDto extends SharedTodoListDto {}

export class RemoveSharedTodoListInputDto {
  @ApiProperty({ description: 'Shared todo list ID' })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class RemoveSharedTodoListOutputDto extends SharedTodoListDto {}
