import { TestBed } from '@angular/core/testing';

import { OrderHttpService } from './order-http.service';

describe('OrderHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderHttpService = TestBed.get(OrderHttpService);
    expect(service).toBeTruthy();
  });
});
