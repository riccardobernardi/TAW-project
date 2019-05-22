import { TestBed } from '@angular/core/testing';

import { ItemHttpService } from './item-http.service';

describe('ItemsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemHttpService = TestBed.get(ItemHttpService);
    expect(service).toBeTruthy();
  });
});
