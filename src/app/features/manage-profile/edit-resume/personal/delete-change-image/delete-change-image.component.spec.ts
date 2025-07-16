import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChangeImageComponent } from './delete-change-image.component';

describe('DeleteChangeImageComponent', () => {
  let component: DeleteChangeImageComponent;
  let fixture: ComponentFixture<DeleteChangeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChangeImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteChangeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
