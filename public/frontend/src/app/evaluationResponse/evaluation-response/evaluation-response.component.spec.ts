import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationResponseComponent } from './evaluation-response.component';

describe('EvaluationResponseComponent', () => {
  let component: EvaluationResponseComponent;
  let fixture: ComponentFixture<EvaluationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
