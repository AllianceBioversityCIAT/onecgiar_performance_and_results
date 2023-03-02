import { TestBed } from '@angular/core/testing';

import { ModuleSelectorService } from './module-selector.service';

describe('ModuleSelectorService', () => {
  let service: ModuleSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
