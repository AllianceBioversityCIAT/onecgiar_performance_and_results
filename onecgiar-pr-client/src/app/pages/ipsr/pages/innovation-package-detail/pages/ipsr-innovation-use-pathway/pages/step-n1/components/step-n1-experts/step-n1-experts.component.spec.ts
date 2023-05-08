import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepN1ExpertsComponent } from './step-n1-experts.component';

describe('StepN1ExpertsComponent', () => {
  let component: StepN1ExpertsComponent;
  let fixture: ComponentFixture<StepN1ExpertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepN1ExpertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepN1ExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
