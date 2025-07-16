import { Component, EventEmitter, inject, input, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { NoDetailsComponent } from '../../../../../shared/components/no-details/no-details.component';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';

interface SkillDetails {
  skillName: string;
  learnedMethods: string[];
  // description: string;
}

@Component({
  selector: 'app-skill',
 imports: [
    TextEditorComponent,
    // SelectboxComponent,
    // NoDetailsSummaryComponent,
    // InputComponent,
    FormsModule,
    AccordionMainBodyComponent,
    NgClass,
    NoDetailsComponent
],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss'
})
export class SkillComponent {
  private accordionService = inject(AccordionManagerService)

  isSkillOpen = input(false);
  isSkillEditFormOpen = signal(false);
  isSkillNewFormOpen = signal(false);
  currentEditingIndex: number | null = null;
  skillDescription = signal('');
  isDescFormOpen = signal(false);
  descriptionControl = new FormControl('');

  private id = "skillinfo";
  skillForm: SkillDetails = {
    skillName: '',
    learnedMethods: [],
  };

  // Sample skill data
  skills: SkillDetails[] = [
    {
      skillName: 'Electrical/ Electronics',
      learnedMethods: ['Self', 'Job'],
    },
    {
      skillName: 'Electrical/ Electronics',
      learnedMethods: ['Self', 'Job', 'Professional', 'NTVFQ'],
    },
    {
      skillName: 'Electrical/ Electronics',
      learnedMethods: ['Self', 'Job', 'Educational'],
    },
  ];
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isSkillOpen() && !this.isOpen()) {
      this.toggle();
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  onClickDescSave() {
    let divElem = document.createElement('div');
    divElem.innerHTML = this.descriptionControl.value as string;
    this.skillDescription.set(divElem.innerText);
    this.onClickDescCancel();
  }

  onClickDescEdit() {
    this.descriptionControl.setValue(this.skillDescription());
    this.isDescFormOpen.set(true);
  }

  onClickDescCancel() {
    this.descriptionControl.setValue('');
    this.isDescFormOpen.set(false);
  }

  // educationLevels = signal([
  //   { value: 'primary', label: 'Primary Education' },
  //   { value: 'secondary', label: 'Secondary Education' },
  //   { value: 'bachelor', label: 'Bachelor' },
  //   { value: 'master', label: 'Master' },
  //   { value: 'phd', label: 'PhD' }
  // ]);

  // degreeTitles = signal([
  //   { value: 'bsc', label: 'Bachelor of Science (BSc)' },
  //   { value: 'msc', label: 'Master of Science (MSc)' },
  //   { value: 'ba', label: 'Bachelor of Arts (BA)' },
  //   { value: 'ma', label: 'Master of Arts (MA)' }
  // ]);


  // educationLevelControl = new FormControl('');
  // degreeTitleControl = new FormControl('');
  // @Output() addExperience = new EventEmitter<void>();

  // toggleDropdown() {
  //   this.isExpanded = !this.isExpanded;
  // }

  // handleAddExperience() {
  //   this.addExperience.emit();
  // }


  // toggleAcademicSummary() {
  //   this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  //   if (!this.isAcademicSummaryExpanded) {
  //     this.cancelEdit();
  //   }
  // }

  editSkill(index: number) {
    this.isSkillEditFormOpen.set(true);
    this.currentEditingIndex = index;
    const skill = this.skills[index];
    
    this.skillForm = {
      skillName: skill.skillName,
      learnedMethods: [...skill.learnedMethods],
    };
  }

  isMethodSelected(method: string): boolean {
    return this.skillForm.learnedMethods.includes(method);
  }

  addNewSkill() {
    this.isSkillNewFormOpen.set(true);
    this.skillForm = {
      skillName: '',
      learnedMethods: [],
    };
  }

  saveSkill() {
    if (this.currentEditingIndex !== null) {
      this.skills[this.currentEditingIndex] = { ...this.skillForm };
    } else {
      this.skills.push({ ...this.skillForm });
    }
    this.cancelEdit();
  }

  // Modify cancelEdit to also handle add mode
  cancelEdit() {
    this.isSkillNewFormOpen.set(false);
    this.isSkillEditFormOpen.set(false);
    this.currentEditingIndex = null;
    this.skillForm = {
      skillName: '',
      learnedMethods: [],
      // description: ''
    };
  }

  toggleMethod(method: string) {
    const index = this.skillForm.learnedMethods.indexOf(method);
    if (index === -1) {
      this.skillForm.learnedMethods.push(method);
    } else {
      this.skillForm.learnedMethods.splice(index, 1);
    }
  }

}




