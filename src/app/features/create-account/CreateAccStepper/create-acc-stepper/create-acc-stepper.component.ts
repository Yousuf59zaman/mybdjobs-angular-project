import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { StepperComponent } from '../../stepper/stepper/stepper.component';

@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [StepperComponent, RouterOutlet],
  templateUrl: './create-acc-stepper.component.html',
  styleUrl: './create-acc-stepper.component.scss'
})
export class CreateAccStepperComponent implements OnInit {

  currentStep: number = 1;
  completedSteps: boolean[] = [];
  stepLabels: Record<number, string> = {};
  private destroyRef = inject(DestroyRef);
  stepHeadings: Record<number, string> = {};
  type: string = '';
  showStepper: boolean = true;
  
  @Input() parentStep?: number;

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

  private hideStepperRoutes: string[] = [
    'create-account-form',
    'otp-verification',
    'welcome'
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadStepLabels();
    this.loadStepHeadings();
    this.updateCurrentStep(this.router.url);
    this.setupTypeSubscription();

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentStep(this.router.url);
    });
  }

  private setupTypeSubscription(): void {
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      this.type = params['type'] || '';
      console.log('Account Type:', this.type);
    });
  }

  getVisibleSteps(): number[] {
    const steps = [1, 2, 4, 5, 6]; // Default steps without physical obstacle
    if (this.type === 'd') {
      steps.splice(2, 0, 3); // Insert physical obstacle step at index 2
    }
    console.log('Visible Steps:', steps);
    return steps;
  }

  private loadStepLabels(): void {
    this.translocoService.selectTranslateObject('stepper').subscribe((translations: any) => {
      this.stepLabels = {
        1: translations['address'],
        2: translations['age'],
        3: translations['phyObstacle'],
        4: translations['workExp'],
        5: translations['eduQua'],
        6: translations['photograph']
      };
    });
  }

  private updateCurrentStep(url: string): void {
    const matchedRoute = Object.keys(this.routeToStepMap).find((route) => url.includes(route));
    const step = matchedRoute ? this.routeToStepMap[matchedRoute] : 0;
    this.currentStep = step;

    // Check if current route should hide stepper
    this.showStepper = !this.hideStepperRoutes.some(route => url.includes(route));
  }

  isStepCompleted(index: number): boolean {
    return this.completedSteps[index];
  }

  isCurrentStep(index: number): boolean {
    return this.currentStep === index + 1;
  }

  getStepLabel(step: number): string {
    return this.stepLabels[step] || '';
  }

  private loadStepHeadings(): void {
    this.translocoService.langChanges$
      .pipe(
        switchMap(() => this.translocoService.selectTranslateObject('stepper')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(translations => {
        if (!translations) {
          console.error('Translations not found');
          return;
        }
    
        this.stepHeadings = {
          1: translations['address'] || 'Your Present Address',
          2: translations['age'] || 'Other Information',
          3: translations['phyObstacle'] || 'Physical barriers',
          4: translations['workExp'] || 'Select your job type',
          5: translations['eduQua'] || 'Educational Qualifications',
          6: translations['photograph'] || 'Upload Photo'
        };
      });
  }

  getHeadingText(): string {
    return this.stepHeadings[this.currentStep] || '';
  }
}
