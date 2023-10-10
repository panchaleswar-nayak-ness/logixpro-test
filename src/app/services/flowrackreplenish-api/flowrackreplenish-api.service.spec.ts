import { TestBed } from '@angular/core/testing';

import { FlowrackreplenishApiService } from './flowrackreplenish-api.service';

describe('FlowrackreplenishApiService', () => {
  let service: FlowrackreplenishApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowrackreplenishApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
