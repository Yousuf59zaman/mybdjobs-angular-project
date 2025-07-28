import { CommonModule, NgClass } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [provideTranslocoScope('stepper')],
  standalone: true,
  imports: [NgClass, TranslocoModule, CommonModule],
})
export class StepperComponent implements OnInit {
  currentStep!: number;
  completedSteps: boolean[] = [];
  isMobileApp = signal<Boolean>(false);
  stepLabels: Record<number, string> = {};
  private destroyRef = inject(DestroyRef);
  @Input() parentStep?: number;
  @Input() type: string = '';
  @Input() visibleSteps: number[] = [];

  ngOnChanges(): void {
    if (this.parentStep !== undefined) {
      this.currentStep = this.parentStep;
    }
  }

  private routeToStepMap: { [key: string]: number } = {
    'address': 1,
    'age-info': 2,
    'physical-obstacle': 3,
    'experience': 4,
    'education': 5,
    'photograph': 6
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadStepLabels();
    this.updateCurrentStep(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateCurrentStep(this.router.url);
    });
  }

  private loadStepLabels(): void {
    this.translocoService.selectTranslateObject('stepper').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((translations: any) => {
      if (!translations) return;

      this.stepLabels = {
        1: translations['address'] || 'Address',
        2: translations['age'] || 'Age',
        3: translations['phyObstacle'] || 'Physical Obstacles',
        4: translations['workExp'] || 'Working Skills',
        5: translations['eduQua'] || 'Educational Qualifications',
        6: translations['photograph'] || 'Photograph'
      };
    });
  }

  currentStep$ = new BehaviorSubject<number>(0);
  private updateCurrentStep(url: string): void {
    const matchedRoute = Object.keys(this.routeToStepMap).find((route) => url.includes(route));
    const step = matchedRoute ? this.routeToStepMap[matchedRoute] : 0;
    this.currentStep$.next(step);
    this.currentStep = step;
  }

  isStepCompleted(index: number): boolean {
    return this.completedSteps[index];
  }

  isCurrentStep(index: number): boolean {
    return this.currentStep === index + 1;
  }

  getStepLabel(step: number): string {
    return this.stepLabels[step] || 'Unknown';
  }

  isStepVisible(step: number): boolean {
    if (step === 3) { // physical-obstacle step
      return this.type === 'd';
    }
    return true;
  }

  getActualStepNumber(step: number): number {
    const visibleSteps = [1, 2, 4, 5, 6];
    if (this.type === 'd') {
      visibleSteps.splice(2, 0, 3);
    }
    return visibleSteps.indexOf(step) + 1;
  }
}
