import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoPersistenceService } from './todo-persistence.service';
import { SharedTodoList, SharedTodoListSchema } from './schema/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SharedTodoList.name, schema: SharedTodoListSchema },
    ]),
  ],
  controllers: [],
  providers: [TodoPersistenceService],
  exports: [TodoPersistenceService],
})
export class TodoPersistenceModule {}
