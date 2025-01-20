import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSchedulingComponent } from './work-scheduling.component';

describe('WorkSchedulingComponent', () => {
  let component: WorkSchedulingComponent;
  let fixture: ComponentFixture<WorkSchedulingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkSchedulingComponent]
    });
    fixture = TestBed.createComponent(WorkSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
