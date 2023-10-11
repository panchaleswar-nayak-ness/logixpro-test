import { TestBed } from '@angular/core/testing';

import { InductionManagerApiService } from './induction-manager-api.service';

describe('InductionManagerApiService', () => {
  let service: InductionManagerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InductionManagerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
