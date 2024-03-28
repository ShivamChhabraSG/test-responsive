import { TestBed } from '@angular/core/testing';

import { SharedEntityServiceService } from './shared-entity-service.service';

describe('SharedEntityServiceService', () => {
  let service: SharedEntityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedEntityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
