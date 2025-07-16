import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileTabsComponent } from './edit-profile-tabs.component';

describe('EditProfileTabsComponent', () => {
  let component: EditProfileTabsComponent;
  let fixture: ComponentFixture<EditProfileTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
