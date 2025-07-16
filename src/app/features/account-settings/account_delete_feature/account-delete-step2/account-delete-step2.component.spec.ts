import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeleteStep2Component } from './account-delete-step2.component';

describe('AccountDeleteStep2Component', () => {
  let component: AccountDeleteStep2Component;
  let fixture: ComponentFixture<AccountDeleteStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeleteStep2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeleteStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
