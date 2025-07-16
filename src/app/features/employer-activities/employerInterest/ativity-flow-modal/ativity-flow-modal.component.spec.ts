import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivityFlowModalComponent } from './ativity-flow-modal.component';

describe('AtivityFlowModalComponent', () => {
  let component: AtivityFlowModalComponent;
  let fixture: ComponentFixture<AtivityFlowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtivityFlowModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtivityFlowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
