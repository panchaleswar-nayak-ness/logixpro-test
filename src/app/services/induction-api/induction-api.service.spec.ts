import { TestBed } from '@angular/core/testing';

import { InductionApiService } from './induction-api.service';

describe('InductionApiService', () => {
  let service: InductionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InductionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
