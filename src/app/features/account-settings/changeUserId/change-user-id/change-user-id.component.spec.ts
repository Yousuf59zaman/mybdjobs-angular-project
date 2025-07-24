import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserIdComponent } from './change-user-id.component';

describe('ChangeUserIdComponent', () => {
  let component: ChangeUserIdComponent;
  let fixture: ComponentFixture<ChangeUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUserIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
