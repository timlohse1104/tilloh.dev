import { ChatEntityDto } from '@backend/shared/types';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ChatMongoDbService } from './chat.mongodb.service';
import { Chat, ChatDocument } from './schema/chat.schema';

describe('ChatMongoDbService', () => {
  let service: ChatMongoDbService;
  let chatModel: Model<ChatDocument>;

  const mockChat = (id: string, name: string): ChatEntityDto => ({
    _id: id,
    name: name,
    messages: [],
    clients: {},
    created: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMongoDbService,
        {
          provide: getModelToken(Chat.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatMongoDbService>(ChatMongoDbService);
    chatModel = module.get<Model<ChatDocument>>(getModelToken(Chat.name));
  });

  it('should find all chats', async () => {
    const result: ChatEntityDto[] = [
      mockChat('1', 'chat1'),
      mockChat('2', 'chat2'),
    ];
    jest
      .spyOn(chatModel, 'find')
      .mockResolvedValue(result as Partial<ChatDocument>[]);
    expect(await service.findAll()).toEqual(result);
  });

  // it('should find one chat', async () => {
  //   const result: ChatEntityDto = mockChat('1', 'chat1');
  //   jest.spyOn(chatModel, 'findOne').mockResolvedValue({
  //     exec: jest.fn().mockReturnValue(result as Partial<ChatDocument>),
  //   });
  //   expect(await service.findOne('1')).toEqual(result);
  // });

  // it('should throw NotFoundException when chat not found', async () => {
  //   jest.spyOn(chatModel, 'findOne').mockResolvedValue(null);
  //   await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  // });

  // it('should create a chat', async () => {
  //   const result: ChatEntityDto = mockChat('1', 'chat1');
  //   jest.spyOn(chatModel, 'create').mockResolvedValue(result as never);
  //   expect(await service.create('chat1')).toEqual(result);
  // });

  // it('should update a chat', async () => {
  //   const result: ChatEntityDto = mockChat('1', 'chat1');
  //   jest
  //     .spyOn(chatModel, 'findOneAndUpdate')
  //     .mockResolvedValue(result as ChatDocument);
  //   expect(await service.update('1', { name: 'chat1' })).toEqual(result);
  // });

  // it('should throw NotFoundException when updating a chat that does not exist', async () => {
  //   jest.spyOn(chatModel, 'findOneAndUpdate').mockResolvedValue(null);
  //   await expect(service.update('1', { name: 'chat1' })).rejects.toThrow(
  //     NotFoundException
  //   );
  // });

  // it('should remove a chat', async () => {
  //   const result: ChatEntityDto = mockChat('1', 'chat1');
  //   jest.spyOn(chatModel, 'findOneAndDelete').mockResolvedValue(result);
  //   expect(await service.remove('1')).toEqual(result);
  // });

  // it('should throw NotFoundException when removing a chat that does not exist', async () => {
  //   jest.spyOn(chatModel, 'findOneAndDelete').mockResolvedValue(null);
  //   await expect(service.remove('1')).rejects.toThrow(NotFoundException);
  // });
});
