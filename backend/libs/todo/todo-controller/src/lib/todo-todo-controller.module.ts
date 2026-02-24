import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { SharedTodoModule } from '@backend/shared-todo';

@Module({
  imports: [SharedTodoModule],
  controllers: [TodoController],
  providers: [],
  exports: [],
})
export class TodoTodoControllerModule {}
