import { TestBed } from '@angular/core/testing';

import { CompanyserviceService } from './companyservice.service';

describe('CompanyserviceService', () => {
  let service: CompanyserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
