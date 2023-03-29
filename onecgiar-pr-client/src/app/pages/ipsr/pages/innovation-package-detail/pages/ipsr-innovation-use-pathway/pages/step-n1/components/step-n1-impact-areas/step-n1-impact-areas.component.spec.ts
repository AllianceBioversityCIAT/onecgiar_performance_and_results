import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepN1ImpactAreasComponent } from './step-n1-impact-areas.component';

describe('StepN1ImpactAreasComponent', () => {
  let component: StepN1ImpactAreasComponent;
  let fixture: ComponentFixture<StepN1ImpactAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepN1ImpactAreasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepN1ImpactAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
