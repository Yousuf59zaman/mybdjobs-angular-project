import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeEmailComponent } from './resume-email.component';

describe('ResumeEmailComponent', () => {
  let component: ResumeEmailComponent;
  let fixture: ComponentFixture<ResumeEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
