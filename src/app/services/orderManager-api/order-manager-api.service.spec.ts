import { TestBed } from '@angular/core/testing';

import { OrderManagerApiService } from './order-manager-api.service';

describe('OrderManagerApiService', () => {
  let service: OrderManagerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderManagerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
