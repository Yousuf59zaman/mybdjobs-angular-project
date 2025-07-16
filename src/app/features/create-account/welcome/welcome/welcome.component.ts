import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';

import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CreateAccountService } from '../../create-account/services/create-account.service';

@Component({
  selector: 'app-welcome',
  imports:[TranslocoModule, RouterLink],
  providers:[provideTranslocoScope('welcome')],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
    
  currentLanguage = 'en';
  accountType='';
  isBlueCollar: boolean = true;
  isDisability: boolean = true;

  constructor(private translocoService: TranslocoService,private createAccountService: CreateAccountService) {
    //this.setUrlBasedOnLanguage(this.translocoService.getActiveLang());
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  ngOnInit() {
    this.getAccountType();
    this.setDefaultLanguage();
  }

  private setDefaultLanguage() {
    const accountType = this.createAccountService.getAccountType();
    if (accountType === 'blueCollar' || accountType === 'disability') {
      this.currentLanguage = 'bn';
      this.translocoService.setActiveLang('bn');
    } else {
      this.currentLanguage = 'en';
      this.translocoService.setActiveLang('en');
    }
  }
  getAccountType(){
    this.accountType = this.createAccountService.getAccountType() || '';
    this.setDefaultLanguage();
  }

}
