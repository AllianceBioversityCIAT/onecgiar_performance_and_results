import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleSelectorPageComponent } from './module-selector-page.component';

describe('ModuleSelectorPageComponent', () => {
  let component: ModuleSelectorPageComponent;
  let fixture: ComponentFixture<ModuleSelectorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleSelectorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleSelectorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
