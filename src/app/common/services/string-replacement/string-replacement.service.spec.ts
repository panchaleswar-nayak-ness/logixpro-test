import { TestBed } from '@angular/core/testing';

import { StringReplacementService } from './string-replacement.service';

describe('StringReplacementService', () => {
  let service: StringReplacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringReplacementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
