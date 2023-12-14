import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorPortfolioLinkagesComponent } from './tor-portfolio-linkages.component';

describe('TorPortfolioLinkagesComponent', () => {
  let component: TorPortfolioLinkagesComponent;
  let fixture: ComponentFixture<TorPortfolioLinkagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorPortfolioLinkagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TorPortfolioLinkagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
