import { Test, TestingModule } from '@nestjs/testing';
import { FocoService } from '../foco.service';

describe('FocoService', () => {
  let service: FocoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocoService],
    }).compile();

    service = module.get<FocoService>(FocoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
