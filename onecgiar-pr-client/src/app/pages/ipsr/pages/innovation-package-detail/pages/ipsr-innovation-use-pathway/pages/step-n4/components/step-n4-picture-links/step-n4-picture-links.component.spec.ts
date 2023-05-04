import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepN4PictureLinksComponent } from './step-n4-picture-links.component';

describe('StepN4PictureLinksComponent', () => {
  let component: StepN4PictureLinksComponent;
  let fixture: ComponentFixture<StepN4PictureLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepN4PictureLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepN4PictureLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
