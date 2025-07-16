import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredAreasComponent } from './preferred-areas.component';

describe('PreferredAreasComponent', () => {
  let component: PreferredAreasComponent;
  let fixture: ComponentFixture<PreferredAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferredAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferredAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
