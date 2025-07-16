import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPassComponent } from './create-new-pass.component';

describe('CreateNewPassComponent', () => {
  let component: CreateNewPassComponent;
  let fixture: ComponentFixture<CreateNewPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
