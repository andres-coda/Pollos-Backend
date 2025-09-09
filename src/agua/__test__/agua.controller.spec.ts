import { Test, TestingModule } from '@nestjs/testing';
import { AguaController } from '../agua.controller';

describe('AguaController', () => {
  let controller: AguaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AguaController],
    }).compile();

    controller = module.get<AguaController>(AguaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
