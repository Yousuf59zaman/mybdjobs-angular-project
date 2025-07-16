import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationBoardComponent } from './invitation-board.component';

describe('InvitationBoardComponent', () => {
  let component: InvitationBoardComponent;
  let fixture: ComponentFixture<InvitationBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
