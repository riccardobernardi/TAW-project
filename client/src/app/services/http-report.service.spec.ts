import { TestBed } from '@angular/core/testing';

import { HttpReportService } from './http-report.service';

describe('HttpReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpReportService = TestBed.get(HttpReportService);
    expect(service).toBeTruthy();
  });
});
