import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResumeComponent } from './delete-resume.component';

describe('DeleteResumeComponent', () => {
  let component: DeleteResumeComponent;
  let fixture: ComponentFixture<DeleteResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
