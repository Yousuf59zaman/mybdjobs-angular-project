import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRelevantInfoComponent } from './other-relevant-info.component';

describe('OtherRelevantInfoComponent', () => {
  let component: OtherRelevantInfoComponent;
  let fixture: ComponentFixture<OtherRelevantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherRelevantInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherRelevantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
