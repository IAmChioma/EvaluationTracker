import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEvaluationResponseComponent } from './edit-evaluation-response.component';

describe('EditEvaluationResponseComponent', () => {
  let component: EditEvaluationResponseComponent;
  let fixture: ComponentFixture<EditEvaluationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEvaluationResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEvaluationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
