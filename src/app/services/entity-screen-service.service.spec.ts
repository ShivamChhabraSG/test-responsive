import { TestBed } from '@angular/core/testing';

import { EntityScreenServiceService } from './entity-screen-service.service';

describe('EntityScreenServiceService', () => {
  let service: EntityScreenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityScreenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
