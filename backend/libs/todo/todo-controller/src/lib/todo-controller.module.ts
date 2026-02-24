import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoProviderModule } from '@backend/todo-provider';

@Module({
  imports: [TodoProviderModule],
  controllers: [TodoController],
  providers: [],
  exports: [],
})
export class TodoControllerModule {}
