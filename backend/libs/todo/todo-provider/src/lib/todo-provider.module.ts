import { Module } from '@nestjs/common';
import { TodoProviderService } from './todo-provider.service';
import { TodoPersistenceModule } from '@backend/todo-persistence';

@Module({
  imports: [TodoPersistenceModule],
  controllers: [],
  providers: [TodoProviderService],
  exports: [TodoProviderService],
})
export class TodoProviderModule {}
