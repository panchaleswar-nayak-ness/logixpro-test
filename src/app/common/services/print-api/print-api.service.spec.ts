import {TestBed} from '@angular/core/testing';

import {PrintApiService} from './print-api.service';

describe('PrintApiService', () => {
  let service: PrintApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
