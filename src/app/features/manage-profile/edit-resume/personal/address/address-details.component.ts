import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressDetailsService } from './service/address-details.service';
import { Address, addressDetailsResponse as AddressDetailsResponse } from './model/address-details.model';
import { Location, EventData, LocationResponse } from './model/locationDetais.model';
import { selectBoxItem } from '../../../../../shared/models/models';
import { CountryResponse } from './model/country.model';
import {AddressDetails} from './model/address-update.model';
import { saveAddressResponse } from './model/saveaddress.model';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { distinctUntilChanged, finalize } from 'rxjs';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { NoDetailsComponent } from '../../../../../shared/components/no-details/no-details.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { ModalService } from '../../../../../core/services/modal/modal.service';
import { isExistSpecialCharacter } from '../../../../common/utility';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { AccordionMainBodyComponent } from "../../../../../shared/components/accordion-main-body/accordion-main-body.component";
import { CookieService } from '../../../../../core/services/cookie/cookie.service';



@Component({
  selector: 'app-address-details',
  imports: [NgClass, CommonModule, ReactiveFormsModule, InputComponent, SelectboxComponent, NoDetailsComponent, TranslocoDirective, AccordionMainBodyComponent],
  providers: [provideTranslocoScope('editResumeAddress')],
  templateUrl: './address-details.component.html',
  styleUrl: './address-details.component.scss'
})
export class AddressDetailsComponent implements AfterViewInit,OnChanges {
  private id = 'address'
  private accordionService = inject(AccordionManagerService)
  isAddressdetailsOpen = input(false)
  isAddressDetailsFormOpen = signal(false)
  selectedOption: string = 'inside';
  selectedOptionPm: string = 'insidePm'
  addressDetailsService = inject(AddressDetailsService)
  private cookieService = inject(CookieService);
  modalService = inject(ModalService)
  presAddress = <Address>{};
  perAddress = <Address>{};
  locationResponse: LocationResponse = <LocationResponse>{};
  districtResponse = signal<selectBoxItem[]>([]);
  thanaResponse = signal<selectBoxItem[]>([]);
  poResponse = signal<selectBoxItem[]>([]);
  locationPermResponse: LocationResponse = <LocationResponse>{};
  districtPermResponse = signal<selectBoxItem[]>([]);
  thanaPermResponse = signal<selectBoxItem[]>([]);
  poPermResponse = signal<selectBoxItem[]>([]);
  countryResponse = signal<selectBoxItem[]>([]);
  countryPermResponse = signal<selectBoxItem[]>([]);
  displayPresAddress: string = '';
  displayPermAddress: string = '';
  isInfoAvailable: boolean = false;
  isExistSpecialCharacter = isExistSpecialCharacter;
  validationDistrictMsg: string = '';
  validationThanaMsg: string = '';
  validationCountryMsg: string = '';
  validationMsgforPresent: string = '';
  validationMsgForVillage: string = '';
  validationMsgPermDis: string = '';
  validationMsgPermThana: string = '';
  validationMsgPermCountry: string = '';
  validationMsgPermVillage: string = '';
  validationMsgPermanent: string = '';
  validationMsgPermVillOut: string = '';
  validationMsgForVillageOut: string = '';

  PresentIsInsert  :number = 1;
  PerIsInsert  :number = 1;
  present_InOut : number = 0;
  per_InOut : number = 0;
  presentAddressType  : number = 1;
  permanentAddressType : number = 2;
  presentAddressId  :number = 0;
  permanentAddressId : number = 0;

  districtId: number = 0;
  thanaId: number = 0;
  district = signal<{ label: string; value: number }[]>([]);
  thana = signal<{ label: string; value: number }[]>([]);
  po = signal<{ label: string; value: number }[]>([]);
  country = signal<{ label: string; value: number }[]>([]);
  isLoading = signal(true);
  saveAddressResponse: saveAddressResponse = <saveAddressResponse>{};

  // UserGuid: string = "BEOhYigwPiGyBFY1PQ00BFU1MRhlYRgyY7Y0IRCxZEGwYxPcBFPtBFU1ZGZ3U1c=";
  userGuid: string | null = null;
  currentLanguage: string = 'EN'
  isBlueCollar: boolean = false;
  toaster = inject(ToasterService);

  ngOnInit(): void {
    const accountType = this.cookieService.getCookie('IsBlueCaller');
    if (accountType === 'True') {
      this.isBlueCollar = true;
    } else {
      this.isBlueCollar = false;
    }

    // const rawGuid = this.cookieService.getCookie('MybdjobsGId'); // for development only
    // this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : null;
    this.userGuid="YiDiBES7YxSyYiJiZu00PlS7MTL9PxYyZxJcPiPlBiCuPFZ1BFPtBFVpUXJNeEU=";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isAddressdetailsOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.fetchUserAddressInfo(this.userGuid ?? '', this.currentLanguage);
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }
  toggle() {
    this.accordionService.toggle(this.id);
  }

  onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion
    if (willOpen) {
      this.fetchUserAddressInfo(this.userGuid ?? '', this.currentLanguage);
    }
  }
  selectOption(option: string) {
    this.selectedOption = option;

    if(this.selectedOption== 'outside'){
        this.fetchCountry(this.currentLanguage)
    }

  }
  selectOptionPm(option: string) {
    this.selectedOptionPm = option;

    if(this.selectedOptionPm== 'outsidePm'){
         this.fetchPermCountry(this.currentLanguage)
    }

  }

  constructor(private translocoService: TranslocoService)
  {
    if (this.isBlueCollar) {
      this.translocoService.setActiveLang('bn'); // Set 'bn' first
    }

    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

  }


  addressForm = new FormGroup({
    district: new FormControl(0),
    PO: new FormControl(0),
    thana: new FormControl(0),
    country: new FormControl(0),
    presentVillage: new FormControl(''),
    sameAddress: new FormControl(false),
    districtPerm: new FormControl(0),
    POPerm: new FormControl(0),
    thanaPerm: new FormControl(0),
    countryPerm: new FormControl(0),
    permVillage: new FormControl('')
  })

  get districtControl(): FormControl {
    return this.addressForm.get('district') as FormControl;
  }

  get districtPermControl(): FormControl {
    return this.addressForm.get('districtPerm') as FormControl;
  }

  get poControl(): FormControl {
    return this.addressForm.get('PO') as FormControl;
  }

  get poPermControl(): FormControl {
    return this.addressForm.get('POPerm') as FormControl;
  }

  get thanaControl(): FormControl {
    return this.addressForm.get('thana') as FormControl;
  }

  get thanaPermControl(): FormControl {
    return this.addressForm.get('thanaPerm') as FormControl;
  }

  get countryControl(): FormControl {
    return this.addressForm.get('country') as FormControl;
  }

  get countryPermControl(): FormControl {
    return this.addressForm.get('countryPerm') as FormControl;
  }


  get presentVillageControl(): FormControl {
    return this.addressForm.get('presentVillage') as FormControl;
  }

  get permVillageControl(): FormControl {
    return this.addressForm.get('permVillage') as FormControl;
  }


  get sameAddressControl(): FormControl {
    return this.addressForm.get('sameAddress') as FormControl;
  }


  closeAddressForm() {
    this.isAddressDetailsFormOpen.set(false);
  }

  openAddressForm() {
    this.isAddressDetailsFormOpen.set(true)
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
        this.districtControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((districtId: number) => {
        this.fetchLocations(this.currentLanguage, districtId, 0, false);
        this.addressForm.patchValue({
          thana: 0,
          PO: 0
      })
    });

    this.thanaControl.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((thanaId: number) => {
      this.fetchLocations(this.currentLanguage, this.districtControl.value, thanaId, false);
      this.addressForm.patchValue({
        PO: 0
      })
    });

    this.districtPermControl.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((districtId: number) => {
      this.fetchPermLocations(this.currentLanguage, districtId, 0, false);
      this.addressForm.patchValue({
        thanaPerm: 0,
        POPerm: 0
      })
    });

    this.thanaPermControl.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((thanaId: number) => {
      this.fetchPermLocations(this.currentLanguage, this.districtPermControl.value, thanaId, false);
      this.addressForm.patchValue({
        POPerm: 0
      })
    });
    }, 10000);

  }

  fetchUserAddressInfo(userId: string, language: string) {
    this.addressDetailsService.getAddressDetails(userId, language)
    .pipe(
            finalize(() => this.isLoading.update(() => false))
        )
    .subscribe({
      next: (response: AddressDetailsResponse) => {
        if(response.event.eventData[0].value.length>0){
          this.isInfoAvailable  = true
          this.presAddress = (response.event.eventData[0].value.find(a => a.addressType == 1 || 3)!);
          this.perAddress = (response.event.eventData[0].value.find(a => a.addressType == 2)!);

          this.fetchLocations(language, 0, 0,true);
          if (this.presAddress) {

            this.PresentIsInsert = 0
            this.displayPresAddress = response.event.eventData[0].value[0].displayLocation;
            this.addressForm.controls['presentVillage'].setValue(this.presAddress.location);
            this.presentAddressId = this.presAddress.addID;

            if(this.presAddress.outsideBD=="False"){
                this.selectedOption = 'inside';
                this.fetchLocations(language, this.presAddress.districtID, 0, true);
                this.fetchLocations(language, this.presAddress.districtID, this.presAddress.thanaID, true);
            }
            else{
              this.selectedOption = 'outside';
              this.fetchCountry(language);
            }

            if(this.presAddress.addressType == 3){
              this.sameAddressControl.setValue(true);
              this.displayPermAddress = "Same as Present Address";
            }
          }

          this.fetchPermLocations(language, 0, 0, true);
          if (this.perAddress) {

            this.PerIsInsert = 2
            this.permanentAddressId = this.perAddress.addID;
            this.displayPermAddress = response.event.eventData[0].value[1].displayLocation;
            this.addressForm.controls['permVillage'].setValue(this.perAddress.location);

            if(this.perAddress.outsideBD=="False"){
              this.selectedOptionPm = 'insidePm';
              this.fetchPermLocations(language, this.perAddress.districtID, 0, true);
              this.fetchPermLocations(language, this.perAddress.districtID, this.perAddress.thanaID, true);
            }
            else{
              this.selectedOptionPm = 'outsidePm';
              this.fetchPermCountry(language);
            }



          }
          else{
            this.selectedOptionPm = '';
          }
        }
        else{
          this.isInfoAvailable = false
          this.fetchLocations(language, 0, 0,true);
          this.fetchPermLocations(language, 0, 0, true);
          this.selectedOption = '';
          this.selectedOptionPm = '';


        }

      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }

  fetchLocations(language: string, districtId: number, thanaId: number, doPatch: boolean = false) {
    this.addressDetailsService.getLocation(language, districtId, thanaId).subscribe({
      next: (response: LocationResponse) => {
        if (districtId && thanaId) {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.poResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.poResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }

          if (this.presAddress.postOfficeID && doPatch) {
            this.addressForm.controls['PO'].setValue(this.presAddress.postOfficeID);
          }
        }
        else if (districtId) {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.thanaResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.thanaResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }

          if (this.presAddress && doPatch) {
            this.addressForm.controls.thana.setValue(this.presAddress.thanaID);
          }
        }
        else {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.districtResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.districtResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }

          if (this.presAddress && doPatch) {
            this.addressForm.controls['district'].setValue(this.presAddress.districtID);
          }
        }
      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }

  fetchPermLocations(language: string, districtId: number, thanaId: number, doPatch: boolean = false) {
    this.addressDetailsService.getLocation(language, districtId, thanaId).subscribe({
      next: (response: LocationResponse) => {
        if (districtId && thanaId) {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.poPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.poPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }


          if (this.perAddress && doPatch) {
            this.addressForm.controls.POPerm.setValue(this.perAddress.postOfficeID);
          }
        }
        else if (districtId) {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.thanaPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.thanaPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }

          if (this.perAddress && doPatch) {
            this.addressForm.controls.thanaPerm.setValue(this.perAddress.thanaID);
          }

        }
        else {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.districtPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinEnglish, value: a.id }));
          }
          else{
            this.districtPermResponse.set(temp.map(a => <selectBoxItem>{ label: a.nameinBangla, value: a.id }));
          }

          if (this.perAddress && doPatch) {
            this.addressForm.controls['districtPerm'].setValue(this.perAddress.districtID);
          }
        }
      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }


  fetchCountry(language: string) {
    this.addressDetailsService.getCountry(language).subscribe({
      next: (response: CountryResponse) => {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.countryResponse.set(temp.map(a => <selectBoxItem>{ label: a.countryName, value: a.countryId }));
          }
          else{
            this.countryResponse.set(temp.map(a => <selectBoxItem>{ label: a.countryNameBangla, value: a.countryId }));
          }

          if (this.presAddress.countryID) {
            this.addressForm.controls['country'].setValue(this.presAddress.countryID);
          }

      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }

  fetchPermCountry(language: string) {
    this.addressDetailsService.getCountry(language).subscribe({
      next: (response: CountryResponse) => {
          const temp = response.event.eventData[0].value;

          if(language == 'en'){
            this.countryResponse.set(temp.map(a => <selectBoxItem>{ label: a.countryName, value: a.countryId }));
          }
          else{
            this.countryResponse.set(temp.map(a => <selectBoxItem>{ label: a.countryNameBangla, value: a.countryId }));
          }

          if (this.perAddress.countryID) {
              this.addressForm.controls['countryPerm'].setValue(this.perAddress.countryID);
          }

      },
      error: (err) => {
        console.log("Error ", err);
      }
    });
  }



  saveAddress() {
    if (!this.validateAddress()) {
      return;
    }
    else {
      if(this.selectedOption == 'inside'){
        this.present_InOut = 0
      }
      else{
        this.present_InOut = 1
      }
      if(this.present_InOut){
        this.districtControl.setValue(0);
        this.thanaControl.setValue(0);
        this.poControl.setValue(0);
      }
      else{
        this.countryControl.setValue(0);
      }

      if(this.selectedOptionPm == 'insidePm'){
        this.per_InOut = 0
      }
      else{
        this.per_InOut = 1
      }

      if(this.per_InOut){
        this.districtPermControl.setValue(0);
        this.thanaPermControl.setValue(0);
        this.poPermControl.setValue(0);
      }
      else{
        this.countryPermControl.setValue(0);
      }

      if(this.sameAddressControl.value){
        this.presentAddressType = 3;
        this.districtPermControl.setValue(0);
        this.thanaPermControl.setValue(0);
        this.poPermControl.setValue(0);
        this.countryPermControl.setValue(0);

      }

      const payload: AddressDetails = {
          guidId: this.userGuid ?? '',
          presentAddressType: this.presentAddressType,
          presentCountryValue: this.countryControl.value,
          presentPostOfficeValue: this.poControl.value,
          presentAddressId: this.presentAddressId,
          presentDistrictValue: this.districtControl.value,
          presentThanaValue: this.thanaControl.value,
          presentVillageValue: this.presentVillageControl.value,
          presentIsInsert: this.PresentIsInsert,
          PresentOutsideBd: this.present_InOut,

          permanentAddressType: this.permanentAddressType,
          permanentCountryValue: this.countryPermControl.value,
          permanentPostOfficeValue: this.poPermControl.value,
          permanentAddressId: this.permanentAddressId,
          permanentDistrictValue: this.districtPermControl.value,
          permanentThanaValue: this.thanaPermControl.value,
          permanentVillageValue: this.permVillageControl.value,
          permanentIsInsert: this.PerIsInsert,
          PermanentOutsideBd : this.per_InOut

      };


      this.addressDetailsService.saveAddress(payload).subscribe({
        next: (response: saveAddressResponse[]) => {
          if(response[0].eventType === 1){
            console.log("success")

            this.toaster.show('Address saved successfully!',
              {
                iconClass: 'lucide-check-circle',
                imageUrl: 'images/check-circle.svg',
                borderColor: 'bg-[#079455]'
            });

            this.fetchUserAddressInfo(this.userGuid ?? '', this.currentLanguage);
            this.isAddressDetailsFormOpen.set(false);

          }
          else{
            console.log("error");
            this.toaster.show('Address saved failed!',
              {
                iconClass: 'lucide-check-circle',
                imageUrl: 'images/x-circle.svg',
                borderColor: 'bg-[#D92D20]'
            });
          }
        },
        error: (err) => {
          console.log("Error ", err);
        }

      });


    }

  }

  validatePresentVillage() {
    let validationMsg = '';

    if (this.presentVillageControl.value == '') {
      validationMsg = "Present House No / Road / Village cannot be empty."
    }
    else if (this.presentVillageControl.value.length > 150) {
      validationMsg = "House No / Road / Village should be limited of 150 characters"
    }
    else if (this.presentVillageControl.value.length <= 150) {
      if (this.isExistSpecialCharacter(this.presentVillageControl.value)) {
        validationMsg = "Present House No/Road/Village contain only letters (Aa to Zz), numbers (0-9), punctuation like (.),(-),(#),(,) and space."
      }
    }

    return validationMsg;
  }

  validatePresentVillageOut() {
    let validationMsg = '';

    if (this.presentVillageControl.value == '') {
      validationMsg = "Present House No / Road / Village cannot be empty."
    }
    else if (this.presentVillageControl.value.length > 150) {
      validationMsg = "House No / Road / Village should be limited of 150 characters"
    }
    else if (this.presentVillageControl.value.length <= 150) {
      if (this.isExistSpecialCharacter(this.presentVillageControl.value)) {
        validationMsg = "Present House No/Road/Village contain only letters (Aa to Zz), numbers (0-9), punctuation like (.),(-),(#),(,) and space."
      }
    }

    return validationMsg;
  }

  validateAddress() {

    if (this.selectedOption == 'inside') {
      if (this.districtControl.value == '') {
        this.validationDistrictMsg = "Please select present District"
        return false;
      }
      if (this.thanaControl.value == '') {
        this.validationThanaMsg = "Please select present Thana"
        return false;
      }

      if (this.validatePresentVillage() != "") {
        this.validationMsgForVillage = this.validatePresentVillage();
        return false;
      }
    }
    else if (this.selectedOption == 'outside') {
      if (this.countryControl.value == '') {
        this.validationCountryMsg = "Please select Country"
        return false;
      }

      if (this.validatePresentVillageOut() != "") {
        this.validationMsgForVillageOut = this.validatePresentVillageOut();
        return false;
      }
    }
    else {
      if (this.selectedOption == '') {
        this.validationMsgforPresent = "Select the present address inside or outside Bangladesh."
        return false;
      }
    }

    if (!this.sameAddressControl.value) {
      if (this.selectedOptionPm != "") {
        if (this.selectedOptionPm == 'insidePm') {
          if (this.districtPermControl.value == "") {
            this.validationMsgPermDis = "Please select permanent District."
            return false;
          }

          if (this.thanaPermControl.value == "") {
            this.validationMsgPermThana = "Please select permanent Thana."
            return false;
          }

          if (this.permVillageControl.value == "") {
            this.validationMsgPermVillage = "Permanent House No / Road / Village cannot be empty."
            return false;
          }
          else if (this.permVillageControl.value.length > 150) {
            this.validationMsgPermVillage = "Permanent House No / Road / Village should be limited of 150 characters"
            return false;
          }
          else if (this.permVillageControl.value.length <= 150) {
            if (this.isExistSpecialCharacter(this.permVillageControl.value)) {
              this.validationMsgPermVillage = "Permanent House No/Road/Village contain only letters (Aa to Zz), numbers (0-9), punctuation like (.),(-),(#),(,) and space."
              return false;
            }
          }
        }
        else if (this.selectedOptionPm == 'outsidePm') {
          if (this.countryPermControl.value == "") {
            this.validationMsgPermCountry = "Please select permanent Country."
            return false;
          }

          if (this.permVillageControl.value == "") {
            this.validationMsgPermVillOut = "Permanent House No / Road / Village cannot be empty."
            return false;
          }
          else if (this.permVillageControl.value.length > 150) {
            this.validationMsgPermVillOut = "Permanent House No / Road / Village should be limited of 150 characters"
            return false;
          }
          else if (this.permVillageControl.value.length <= 150) {
            if (this.isExistSpecialCharacter(this.permVillageControl.value)) {
              this.validationMsgPermVillOut = "Permanent House No/Road/Village contain only letters (Aa to Zz), numbers (0-9), punctuation like (.),(-),(#),(,) and space."
              return false;
            }
          }


        }
      }
      else {
        this.validationMsgPermanent = "Select the permanent address inside or outside Bangladesh."
        return false;
      }
    }
    return true;
  }








}
