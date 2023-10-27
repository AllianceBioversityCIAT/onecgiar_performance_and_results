import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCompletenessStatusComponent } from './global-completeness-status.component';

describe('GlobalCompletenessStatusComponent', () => {
  let component: GlobalCompletenessStatusComponent;
  let fixture: ComponentFixture<GlobalCompletenessStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalCompletenessStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalCompletenessStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
