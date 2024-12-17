import { TestBed } from '@angular/core/testing';

import { FieldMappingsInitializerService } from './field-mappings-initializer.service';

describe('FieldMappingsInitializerService', () => {
  let service: FieldMappingsInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldMappingsInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
