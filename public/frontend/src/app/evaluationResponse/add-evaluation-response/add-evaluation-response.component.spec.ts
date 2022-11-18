import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvaluationResponseComponent } from './add-evaluation-response.component';

describe('AddEvaluationResponseComponent', () => {
  let component: AddEvaluationResponseComponent;
  let fixture: ComponentFixture<AddEvaluationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEvaluationResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEvaluationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
