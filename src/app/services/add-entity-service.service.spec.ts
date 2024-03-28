import { TestBed } from '@angular/core/testing';

import { AddEntityServiceService } from './add-entity-service.service';

describe('AddEntityServiceService', () => {
  let service: AddEntityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddEntityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
