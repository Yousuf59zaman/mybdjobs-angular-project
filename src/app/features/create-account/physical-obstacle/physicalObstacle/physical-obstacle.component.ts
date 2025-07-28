import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnswerOption, ApiResponse, PostForm, Question } from '../model/physicalObstacle';
import { PhysicalObstacleService } from '../service/physical-obstacle.service';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { RadioComponent } from '../../../../shared/components/radio/radio.component';

@Component({
  selector: 'app-physical-obstacle',
  standalone: true,
  templateUrl: './physical-obstacle.component.html',
  styleUrls: ['./physical-obstacle.component.scss'],
  imports: [CommonModule, InputComponent, RadioComponent, ReactiveFormsModule]
})
export class PhysicalObstaclesComponent implements OnInit {
  phyObstacle: FormGroup;
  guid: string='';

  questions: Question[] = [
    { text: 'আপনার কি অসুবিধা হয়?', name: 'seenproblem', value: '1', answerKey: 'answer1' },
    { text: 'আপনার কি শুনতে সমস্যা হয়?', name: 'hearproblem', value: '2', answerKey: 'answer2' },
    { text: 'বসতে, দাড়াতে, হাটতে / সিড়ি দিয়ে উঠতে কোন অসুবিধা হয়?', name: 'sswcproblem', value: '3', answerKey: 'answer3' },
    { text: 'স্মরণ রাখতে বা মনোনিবেশ করতে অসুবিধা হয়?', name: 'concproblem', value: '4', answerKey: 'answer4' },
    { text: 'যোগাযোগ করার ক্ষেত্রে কোন অসুবিধা হচ্ছে কি?', name: 'commproblem', value: '5', answerKey: 'answer5' },
    { text: 'নিজের যত্ন যেমন- গোসল করা, জামা কাপড় পরতে কোনো অসুবিধা হয়?', name: 'tcareproblem', value: '6', answerKey: 'answer6' }
  ];
  answerOptions: { [key: string]: AnswerOption[] } = {
    answer1: [
      { id: 'Can not do at all', name: 'answer1', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer1', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer1', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ],
    answer2: [
      { id: 'Can not do at all', name: 'answer2', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer2', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer2', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ],
    answer3: [
      { id: 'Can not do at all', name: 'answer3', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer3', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer3', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ],
    answer4: [
      { id: 'Can not do at all', name: 'answer4', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer4', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer4', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ],
    answer5: [
      { id: 'Can not do at all', name: 'answer5', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer5', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer5', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ],
    answer6: [
      { id: 'Can not do at all', name: 'answer6', label: 'একদমই পারিনা' },
      { id: 'Yes - a lot of difficulty', name: 'answer6', label: 'হ্যাঁ- অনেক বেশি অসুবিধা হয়' },
      { id: 'Yes - some difficulty', name: 'answer6', label: 'হ্যাঁ- কিছু অসুবিধা আছে' }
    ]
  };

  private fb = inject(FormBuilder);
  private phyObstacleService = inject(PhysicalObstacleService);
  private router = inject(Router);
  private cookieService = inject(CookieService)

  constructor() {
    this.phyObstacle = this.fb.group({
      seenproblem: [0],
      hearproblem: [0],
      sswcproblem: [0],
      concproblem: [0],
      commproblem: [0],
      tcareproblem: [0],
      disabilityId: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(20),Validators.pattern(/^[0-9]+$/)]]
    });
  }
  ngOnInit(): void {
    this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);
  }

  getQuestionControl(questionName: string): FormControl {
    return this.phyObstacle.get(questionName) as FormControl;
  }

  get disabilityIdControl(): FormControl {
    return this.phyObstacle.get('disabilityId') as FormControl;
  }

  getAnswerByControl(controlName: string): string {
    const controlValue = this.phyObstacle.get(controlName)?.value;
    const question = this.questions.find(q => q.name === controlName);
    if (!question) {
      console.warn(`No question found for control name: ${controlName}`);
      return '';
    }

    const answerMapping = this.answerOptions[question.answerKey];
    if (!answerMapping) {
      console.warn(`No answer mapping found for key: ${question.answerKey}`);
      return '';
    }
    const selectedOption = answerMapping.find(option => option.id === controlValue);
    return selectedOption ? selectedOption.label : '';
  }


  onSubmit(): void {
  this.phyObstacle.markAllAsTouched();

  if (this.phyObstacle.valid) {
    const payload: PostForm = {
      // GuidId: "ec1b90fc-ea01-49d8-8d2a-8c92d1348cab",
      userGuidId: this.guid,
      seenProblemDtId: 1,
      seenProblem: this.getAnswerByControl('seenproblem'),
      hearProblemDtId: 2,
      hearProblem: this.getAnswerByControl('hearproblem'),
      sswcProblemDtId: 3,
      sswcProblem: this.getAnswerByControl('sswcproblem'),
      concProblemDtId: 4,
      concProblem: this.getAnswerByControl('concproblem'),
      commProblemDtId: 5,
      commProblem: this.getAnswerByControl('commproblem'),
      tCareProblemDtId: 6,
      tCareProblem: this.getAnswerByControl('tcareproblem'),
      disabilityId: this.phyObstacle.value.disabilityId,
    };


    this.phyObstacleService.submitPhysicalForm(payload).subscribe((result: ApiResponse[]) => {
      if (result && result.length > 0 && result[0].eventType === 1) {
        this.router.navigate(['create-account/experience-info']);
      }
    });
  }
   // Navigate to OTP verification page
}
}
