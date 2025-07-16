import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeUserDialogueBoxComponent } from './free-user-dialogue-box.component';

describe('FreeUserDialogueBoxComponent', () => {
  let component: FreeUserDialogueBoxComponent;
  let fixture: ComponentFixture<FreeUserDialogueBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeUserDialogueBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeUserDialogueBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
