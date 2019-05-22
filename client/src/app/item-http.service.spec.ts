import { TestBed } from '@angular/core/testing';

import { ItemsServiceService } from './items-service.service';

describe('ItemsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemsServiceService = TestBed.get(ItemsServiceService);
    expect(service).toBeTruthy();
  });
});
