import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StepTwoBasicInfoComponent, InnovationComplementary } from './step-two-basic-info.component';
import { IpsrDataControlService } from '../../../../../../../../services/ipsr-data-control.service';
import { ApiService } from '../../../../../../../../../../shared/services/api/api.service';
import { of } from 'rxjs';

describe('StepTwoBasicInfoComponent', () => {
  let component: StepTwoBasicInfoComponent;
  let fixture: ComponentFixture<StepTwoBasicInfoComponent>;
  let apiServiceMock: any;
  let ipsrDataControlServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      isStepTwoTwo: false,
      isStepTwoOne: true,
      resultsSE: {
        PostStepTwoComentariesInnovation: jest.fn().mockReturnValue(of({})),
        PostStepTwoComentariesInnovationPrevius: jest.fn().mockReturnValue(of({})),
        getStepTwoComentariesInnovationId: jest.fn().mockReturnValue(of({ response: { results: [] } })),
        getStepTwoComentariesInnovation: jest.fn().mockReturnValue(of({ response: { comentaryPrincipals: [] } }))
      },
      rolesSE: {
        readOnly: false
      }
    };

    ipsrDataControlServiceMock = {
      resultInnovationCode: '123',
      resultInnovationPhase: '1'
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [StepTwoBasicInfoComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: IpsrDataControlService, useValue: ipsrDataControlServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component with correct values', () => {
    component.ngOnInit();
    expect(apiServiceMock.isStepTwoTwo).toBe(true);
    expect(apiServiceMock.isStepTwoOne).toBe(false);
    expect(apiServiceMock.resultsSE.getStepTwoComentariesInnovationId).toHaveBeenCalled();
    expect(apiServiceMock.resultsSE.getStepTwoComentariesInnovation).toHaveBeenCalled();
  });

  it('should call PostStepTwoComentariesInnovation on save', () => {
    component.onSaveSection();
    expect(apiServiceMock.resultsSE.PostStepTwoComentariesInnovation).toHaveBeenCalledWith(component.bodyStep2);
  });

  it('should return correct goToStep link', () => {
    const link = component.goToStep();
    expect(link).toBe(
      `<a class='open_route' href='/ipsr/detail/123/ipsr-innovation-use-pathway/step-2/complementary-innovation?phase=1' target='_blank'> Go to step 2.1</a>`
    );
  });

  it('should navigate correctly on savePreviousNext when readOnly is true', () => {
    apiServiceMock.rolesSE.readOnly = true;
    component.api.isStepTwoTwo = true;
    component.onSavePreviuosNext('next');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/ipsr/detail/123/ipsr-innovation-use-pathway/step-3'], { queryParams: { phase: '1' } });
  });

  it('should call PostStepTwoComentariesInnovationPrevius on savePreviousNext when readOnly is false', () => {
    apiServiceMock.rolesSE.readOnly = false;
    component.api.isStepTwoTwo = true;
    component.onSavePreviuosNext('next');
    expect(apiServiceMock.resultsSE.PostStepTwoComentariesInnovationPrevius).toHaveBeenCalledWith(component.bodyStep2, 'next');
  });
});
