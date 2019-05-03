import { TestBed } from '@angular/core/testing';

import { SendOrderService } from './send-order.service';

describe('SendOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendOrderService = TestBed.get(SendOrderService);
    expect(service).toBeTruthy();
  });
});
