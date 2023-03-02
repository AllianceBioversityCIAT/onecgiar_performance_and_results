import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagementComponent } from './risk-management.component';

describe('RiskManagementComponent', () => {
  let component: RiskManagementComponent;
  let fixture: ComponentFixture<RiskManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
