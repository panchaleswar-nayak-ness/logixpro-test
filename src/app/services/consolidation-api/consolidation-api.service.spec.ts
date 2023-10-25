import { TestBed } from '@angular/core/testing';

import { ConsolidationApiService } from './consolidation-api.service';

describe('ConsolidationApiService', () => {
  let service: ConsolidationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
