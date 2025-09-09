import { Test, TestingModule } from '@nestjs/testing';
import { FocoController } from '../foco.controller';

describe('FocoController', () => {
  let controller: FocoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocoController],
    }).compile();

    controller = module.get<FocoController>(FocoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
