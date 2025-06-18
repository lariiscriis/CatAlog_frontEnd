import { TestBed } from '@angular/core/testing';

import { EstanteService } from './estante.service';

describe('EstanteService', () => {
  let service: EstanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
