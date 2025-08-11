import { Routes } from '@angular/router';
import { CreateAccStepperComponent } from './features/create-account/CreateAccStepper/create-acc-stepper/create-acc-stepper.component';
// import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [

  // Route For Create Account
  {
    path: '', redirectTo: 'signin',
    data: { layout: 'right' },
    pathMatch: 'full'
  },
  {
    path: 'create-account/otp-verification',
    data: { layout: 'right' },
    loadComponent: () => import('./features/create-account/otp-verification/otp-verification/otp-verification.component').then((c) => c.OtpVerificationComponent),
  },
  {
    path: "create-account",
    component: CreateAccStepperComponent,
    children: [
      {
        path: 'create-account-form',
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/create-account/create-account-form/create-account-form.component').then((c) => c.CreateAccountFormComponent),
      },
      {
        path: "address-info",
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/AddressComponent/address/address.component').then((c) => c.AddressComponent),
      },
      {
        path: "age-info",
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/birth-info/birth-info/birth-info.component').then((c) => c.BirthInfoComponent),
      },
      {
        path: "physical-obstacle",
        data: { layout: 'right' },
        loadComponent: () =>
          import('./features/create-account/physical-obstacle/physicalObstacle/physical-obstacle.component').then(
            (c) => c.PhysicalObstaclesComponent),
      },
      {
        path: "experience-info",
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/experience/experience/experience.component').then((c) => c.ExperienceComponent),
      },
      {
        path: "education-info",
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/EducationComponent/education/education.component').then((c) => c.EducationComponent),
      },
      {
        path: 'account-delete-step2',
        data: { layout: 'left' },
        loadComponent: () =>
          import(
            './features/account-settings/account_delete_feature/account-delete-step2/account-delete-step2.component'
          ).then((c) => c.AccountDeleteStep2Component),
      },
      {
        path: 'upload-photo',
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/upload-photo/upload-photo.component').then((c) => c.UploadPhotoComponent),

      },
      {
        path: 'welcome',
        data: { layout: 'right' },
        loadComponent: () => import('./features/create-account/welcome/welcome/welcome.component').then((c) => c.WelcomeComponent),
      },
    ]
  },

  // Create Account End

  {
    path: 'employer-message',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/employer-activities/employer_message_feature/view-employer-message/view-employer-message.component'
      ).then((c) => c.ViewEmployerMessageComponent),
  },
  {
    path: 'favouritesearch',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/personalization/favourite_search_feature/favourite-search/favourite-search.component'
      ).then((c) => c.FavouriteSearchComponent),
  },
  {
    path: 'show_cart',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/my-activities/shortlisted_job_feature/shortlisted-job/shortlisted-job.component'
      ).then((c) => c.ShortlistedJobComponent),
  },
  {
    path: 'resume-email',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/my-activities/resume-email/resume-email/resume-email/resume-email.component'
      ).then((c) => c.ResumeEmailComponent),
  },
  {
    path: 'change-user-id',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/account-settings/changeUserId/change-user-id/change-user-id.component'
      ).then((c) => c.ChangeUserIdComponent),
  },

  {
    path: "email-cv",
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/emailCV/email-CV/email-cv/email-cv.component').then(
        (c) => c.EmailCVComponent
      ),
  },
  {
    path: "details-cv",
    data: { layout: 'default' },
    loadComponent: () =>
      import('./features/cv/detailsCV/details-cv/details-cv.component').then(
        (c) => c.DetailsCVComponent
      ),
  },
  {
    path: "short-cv",
    data: { layout: 'default' },
    loadComponent: () =>
      import('./features/cv/shortCV/short-cv/short-cv.component').then(
        (c) => c.ShortCvComponent
      ),
  },
  {
    path: 'employer_interest',
    data: { layout: 'left' },
    loadComponent: () => import('./features/employer-activities/employerInterest/employer-interest/employer-interest.component').then((c) => c.EmployerInterestComponent),
  },
  {
    path: 'employer-viewed-cv',
    data: { layout: 'left' },
    loadComponent: () => import('./features/employer-activities/employerViewedCv/employer-viewed-cv/employer-viewed-cv.component').then((c) => c.EmployerViewedCvComponent),
  },

  {
    path: 'view-resume',
    data: { layout: 'left' },
    loadComponent: () => import('./features/manage-profile/view-profile/view_resume/view-resume/view-resume.component').then((c) => c.ViewResumeComponent),
  },
  {
    path: 'point-reward',
    data: { layout: 'left' },
    loadComponent: () => import('./features/points-rewards/point-reward/point-reward/point-reward.component').then((c) => c.PointsRewardsComponent),
  },

  {
    path: 'account-setting',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/account-settings/accountsetting_feature/account-setting/account-setting.component'
      ).then((c) => c.AccountSettingComponent),
  },
  {
    path: 'account-delete',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/account-settings/account_delete_feature/account-delete/account-delete.component'
      ).then((c) => c.AccountDeleteComponent),
  },
  {
    path: 'account-delete-step2',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/account-settings/account_delete_feature/account-delete-step2/account-delete-step2.component'
      ).then((c) => c.AccountDeleteStep2Component),
  },

  {
    path: 'address-details',
    data: { layout: 'left' },
    loadComponent: () =>
      import(
        './features/manage-profile/edit-resume/personal/address/address-details.component').then((c) => c.AddressDetailsComponent)

  },
  {
    path: 'academicsummary',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/academic/edit-education/edit-education.component').then(
        (c) => c.EditEducationComponent
      ),
  },

  {
    path: 'training',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/academic/education-training/education-training.component').then(
        (c) => c.EducationTrainingComponent
      ),
  },
  {
    path: 'preview',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/personal/photo-upload/previewimage/uploadimage.component').then(
        (c) => c.UploadimageComponent
      ),
  },
  {
    path: 'upload',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/personal/photo-upload/uploadphoto/uploadphoto.component').then(
        (c) => c.UploadPhotosComponent
      ),
  },
  {
    path: 'deletechangeimage',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/personal/delete-change-image/delete-change-image.component').then(
        (c) => c.DeleteChangeImageComponent
      ),
  },
  {
    path: 'edit-profile',
    data: { layout: 'left' },
    loadComponent: () => import('./features/manage-profile/edit-resume/edit-profile/edit-profile.component').then((c) => c.EditProfileComponent)
  },
  {
    path: 'date',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./shared/components/date-single-date-picker/date-single-date-picker.component').then(
        (c) => c.DateSingleDatePickerComponent
      ),
  },
  {
    path: 'preferred-areas',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/personal/preferred-areas/preferred-areas/preferred-areas.component').then((c) => c.PreferredAreasComponent)
  },
  {
    path: 'signin',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/signin/pages/home/home.component').then((c) => c.HomeComponent),
    // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    data: { layout: 'left' },
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then((c) => c.DashboardComponent)
  },
  {
    path: 'delete-resume',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/account-settings/delete-resume/delete-resume.component').then(
        (c) => c.DeleteResumeComponent
      ),
  },
  {
    path: 'payment-confirmation',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/payment-activity/payment/payment.component').then(
        (c) => c.PaymentComponent
      ),
  },
  {
    path: 'email-notification',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/notifications/email-notification/email-notification.component').then(
        (c) => c.EmailNotificationComponent
      ),
  },
  {
    path: 'account-settings',
    data: { layout: 'left' },
    loadComponent: () =>
      import('./features/account-settings/account-settings/account-settings.component').then(
        (c) => c.AccountSettingsComponent
      ),
  },
  {
    path: 'professional-certificate',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/academic/ProfessionalCertificate/professional-certification-summary/professional-certification-summary.component').then(
        (c) => c.ProfessionalCertificationSummaryComponent
      ),
  },
   {
    path: 'employement-army',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/employment/ArmyEmployment/employment-history-armyperson/employment-history-armyperson.component').then(
        (c) => c.EmploymentHistoryArmypersonComponent
      ),
  },
  {
    path: 'skill',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/other information/SkillComponent/skill/skill.component').then(
        (c) => c.SkillComponent
      ),
  },
  {
    path: 'reference',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/manage-profile/edit-resume/other information/ReferenceComponent/references/references.component').then(
        (c) => c.ReferencesComponent
      ),
  },
  {
    path: 'applied-jobs',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/my-activities/applied-jobs/applied-jobs.component').then(
        (c) => c.AppliedJobsComponent
      ),
  },
  {
    path: 'resume-privacy',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/account-settings/account_resume_privacy/profile-preference/profile-preference.component').then(
        (c) => c.ProfilePreferenceComponent
      ),
  },
  {
  path: 'change-userid',
  data: { layout: 'left' },
  loadComponent: () =>
    import(
      './features/account-settings/changeUserId/change-user-id/change-user-id.component'
    ).then((c) => c.ChangeUserIdComponent),
  },


  {

     path: 'changepassword',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/signin/forget-password/create-new-pass/create-new-pass.component').then(
        (c) => c.CreateNewPassComponent
      ),

  },



    {

     path: 'change-password',
    data: {layout:'left'},
    loadComponent: () =>
      import('./features/account-settings/change-password/change-password.component').then(
        (c) => c.ChangePasswordComponent
      ),

  }

];

