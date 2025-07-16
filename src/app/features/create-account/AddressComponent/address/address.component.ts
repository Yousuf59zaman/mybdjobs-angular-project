import { Component, OnInit , computed, inject} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { District, PostLocation } from '../models/address';
import { ReactiveFormsModule ,FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AddressDataService } from '../service/address-data.service';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { NumericOnlyDirective } from '../../../../core/directives/numeric-only.dir';


@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    FormsModule,
    CommonModule,
    TranslocoModule,
    NumericOnlyDirective
  ],
  providers:[provideTranslocoScope('address')],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  private fb = inject(FormBuilder);
  private ca = inject(CreateAccountService)
  private addressService = inject(AddressDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  addressForm: FormGroup;

  districts: District[] = [];
  thanas: District[] = [];
  postOffices: District[] = [];
  addressObj: PostLocation = {} as PostLocation;
  isSubmitted: boolean = false;
  isHouse: boolean = false;
  accountType: string ="b";
  isBlueCollar = false;
  isDisability = false;
  currentLanguage: string="EN";
  guid : string ='';

  constructor(
    private translocoService: TranslocoService,
    private cookieService: CookieService
  ) {
    this.addressForm = this.fb.group({
      districtId: [null,Validators.required],
      thanaId: [null,Validators.required],
      postOfficeId: [null],
      houseNoOrRoadVillageControl: ['', Validators.required],
      AlternativePhone: ['', [Validators.required, Validators.pattern(/^(\+8801[3-9]\d{8})|(01[3-9]\d{8})$/), Validators.maxLength(13)]],
      lanType: [''],
      isInsideBd: [''],
      sessionDate: ['']
    });
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      this.isBlueCollar = type === "b";
      this.isDisability = type === "d";
      if (this.isBlueCollar || this.isDisability) {
        this.currentLanguage = 'BN';
        console.log(this.currentLanguage);

        this.translocoService.setActiveLang('bn');
      }
      // Store account type in service
      this.ca.setAccountType(type || 'w');
    });
    this.loadDistricts();

    this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);
    console.log('guid from cookie:', this.guid);
  }

  houseNoOrRoadVillageControl = computed(
    () => this.addressForm.get('houseNoOrRoadVillageControl') as FormControl
  );

  loadDistricts(): void {
    this.addressService.getDistricts().subscribe(data => {
      this.districts = data;
    });
  }

  onDistrictChange(event: any): void {
    const districtId = event.target.value;
    if (districtId) {
      this.addressService.getThanas(districtId).subscribe(data => {
        this.thanas = data;
        this.postOffices = [];
      });
    }
  }

  onThanaChange(event: any): void {
    const thanaId = event.target.value;
    const districtId = event.target.value;
    if (thanaId) {
      this.addressService.getPostOffices(districtId,thanaId).subscribe(data => {
        this.postOffices = data;
      });
    }
  }
  checkValidation(data: any): void
  {
    if (!this.addressForm.value.districtId) {
      this.addressForm.controls['districtId'].setErrors({ required: true });
    }

    else if (!this.addressForm.value.thanaId) {
      this.addressForm.controls['thanaId'].setErrors({ required: true });
    }
    else if(data.AlternativePhone == null || data.AlternativePhone == "")
    {
      this.isSubmitted=true;
      this.addressForm.controls['AlternativePhone'].setErrors({required: true})
    }
    else if(data.houseNoOrRoadVillageControl ==null || data.houseNoOrRoadVillageControl =="")
    {
      this.isHouse=true;
      this.addressForm.controls['houseNoOrRoadVillageControl'].setErrors({required: true})
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.checkValidation(this.addressForm.value);
    this.addressForm.markAllAsTouched();
    console.log(this.addressForm.valid);
    if (this.addressForm.valid) {
       const payload: PostLocation = {
        GuidId: this.guid,
        DistrictId: this.addressForm.value.districtId,
        ThanaId: this.addressForm.value.thanaId,
        PostOfficeId: this.addressForm.value.postOfficeId,
        HouseNoOrRoadVillage: this.addressForm.value.houseNoOrRoadVillageControl,
        AlternativePhone: this.addressForm.value.AlternativePhone,
        LanType: this.currentLanguage,
        IsOutsideBd: 0,
        Session_date: new Date()
      };
      this.addressService.submitAddress(payload).subscribe((result:any)=>{
        const event = result[0];
        if (event.eventType === 1) {
            console.log("Success");
          }
          this.router.navigate(['create-account/age-info']);
      });
    }
    else
    {
      console.log("form is invalid");

    }
  }
}
