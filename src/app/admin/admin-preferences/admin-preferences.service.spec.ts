import { TestBed } from '@angular/core/testing';

import { AdminPreferencesService } from './admin-preferences.service';

describe('AdminPreferencesService', () => {
  let service: AdminPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
