import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingToolComponent } from './reporting-tool.component';

describe('ReportingToolComponent', () => {
  let component: ReportingToolComponent;
  let fixture: ComponentFixture<ReportingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
