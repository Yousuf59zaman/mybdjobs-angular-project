import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePreferenceComponent } from './profile-preference.component';

describe('ProfilePreferenceComponent', () => {
  let component: ProfilePreferenceComponent;
  let fixture: ComponentFixture<ProfilePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
