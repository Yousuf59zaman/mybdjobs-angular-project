import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseYourAccountComponent } from './choose-your-account.component';

describe('ChooseYourAccountComponent', () => {
  let component: ChooseYourAccountComponent;
  let fixture: ComponentFixture<ChooseYourAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseYourAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseYourAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
