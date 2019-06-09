import { TestBed } from '@angular/core/testing';

import { TableHttpService } from './table-http.service';

describe('TableHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableHttpService = TestBed.get(TableHttpService);
    expect(service).toBeTruthy();
  });
});
