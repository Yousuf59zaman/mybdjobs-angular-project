import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployerMessageComponent } from './view-employer-message.component';

describe('ViewEmployerMessageComponent', () => {
  let component: ViewEmployerMessageComponent;
  let fixture: ComponentFixture<ViewEmployerMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployerMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
