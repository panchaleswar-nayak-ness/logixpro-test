import { TestBed } from '@angular/core/testing';

import { GlobalConfigApiService } from './global-config-api.service';

describe('GlobalConfigApiService', () => {
  let service: GlobalConfigApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalConfigApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
