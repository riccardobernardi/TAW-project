import { TestBed } from '@angular/core/testing';

import { TicketHttpService } from './ticket-http.service';

describe('TicketHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketHttpService = TestBed.get(TicketHttpService);
    expect(service).toBeTruthy();
  });
});
