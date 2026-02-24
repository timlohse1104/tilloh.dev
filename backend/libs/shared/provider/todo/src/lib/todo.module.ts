import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { TodoMongoDbService } from './todo-mongodb.service';
import { SharedTodoList, SharedTodoListSchema } from './schema/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SharedTodoList.name, schema: SharedTodoListSchema },
    ]),
  ],
  controllers: [],
  providers: [TodoService, TodoMongoDbService],
  exports: [TodoService],
})
export class SharedTodoModule {}