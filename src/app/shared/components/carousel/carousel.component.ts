import { ChangeDetectionStrategy, Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './carousel.component.html',
    // styleUrl: './carousel.component.scss',
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class CarouselComponent {

}