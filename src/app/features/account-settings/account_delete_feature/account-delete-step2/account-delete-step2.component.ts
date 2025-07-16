import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-account-delete-step2',
  imports: [ReactiveFormsModule,TranslocoModule],
  templateUrl: './account-delete-step2.component.html',
  styleUrl: './account-delete-step2.component.scss',
  providers: [provideTranslocoScope("accountDelete")]
})
export class AccountDeleteStep2Component {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      reason: [null],
      notUsefulChecks: this.fb.array([]),
      notUsefulOther: [''],
      othersText: ['']
    });

    // whenever you switch radios, clear all nested state
    this.form.get('reason')!.valueChanges.subscribe(() => {
      this.clearNested();
    });
  }

  get notUsefulChecks(): FormArray {
    return this.form.get('notUsefulChecks') as FormArray;
  }

  onCheckNotUseful(value: string, evt: Event) {
    const checked = (evt.target as HTMLInputElement).checked;
    if (checked) {
      this.notUsefulChecks.push(this.fb.control(value));
    } else {
      const idx = this.notUsefulChecks.controls.findIndex(c => c.value === value);
      if (idx > -1) this.notUsefulChecks.removeAt(idx);
    }
  }

  private clearNested() {
    // clear all checkboxes & inputs
    while (this.notUsefulChecks.length) { this.notUsefulChecks.removeAt(0); }
    this.form.patchValue({ notUsefulOther: '', othersText: '' });
  }

  onSubmit() {
    console.log(this.form.value);
    // hook up your delete service here…
  }
}
