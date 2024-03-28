import { TestBed } from '@angular/core/testing';

import { DateFormatWithoutTimeService } from './date-format-without-time.service';

describe('DateFormatWithoutTimeService', () => {
  let service: DateFormatWithoutTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatWithoutTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
