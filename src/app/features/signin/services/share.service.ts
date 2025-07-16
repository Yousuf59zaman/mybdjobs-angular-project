import { Injectable, signal } from "@angular/core";
import { checkUserNameResponse, getUserListResponse } from '../models/login.model';

export type rightPanel = 'username' | 'password' | 'otp' | 'find-acc' | 'choose_acc' | 'linkedin' | 'google'
  | 'welcome' | 'sec_code' | 'access_acc' | 'reset_pass' | 'success'
@Injectable({
  providedIn: 'root'
})

export class SharedService {
  currentPanel = signal<rightPanel>('username');
  isUsername = signal(false)
  isOtp = signal(false)
  isLoading = signal(false)
  userInfo = signal<checkUserNameResponse | null>({
    username: '',
    result: '0',
    fullName: '',
    emailAddress: '',
    status: 1,
    photoUrl: '',
    isAccountActive: true,
    phoneNumber: '',
    otp: 0,
    purpose: 'login',
    guidId: ''
  })
  userList = signal<getUserListResponse[]>([]);
  selectedUser = signal<any>(null)


  constructor() { }
  readonly selectedTab = signal<string>('SignIn');

  setTab(tab: string) {
    this.selectedTab.set(tab);
  }

  goToSignUpFlow() {
    this.updateType('username');
    this.setTab('SignUp');
  }

  updateType(value: rightPanel) {
    this.currentPanel.set(value)
    console.log("current Panel", value);

  }

  updateUserObject(value: checkUserNameResponse | null) {
    this.userInfo.set(value)
    console.log("Service Obj:", this.userInfo())
  }

  updateUserInfo = (username: string, fullName: string, guidId: string, profilePicture: string, emailAddress: string, phoneNumber: string) => {
    this.userInfo.update(current => {
      if (!current) return current;

      return {
        ...current,
        username: username,
        fullName: fullName,
        guidId: guidId,
        photoUrl: profilePicture,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber

      } as checkUserNameResponse;
    });
    console.log("userInfo", this.userInfo())
  };

  updateUserList(userList: getUserListResponse[]) {
    this.userList.set(userList);
    console.log(userList);
  }
  updateSelectedUser(user: any) {
    this.selectedUser.set(user);
    console.log("selected User", this.selectedUser())
  }

  isLoaderTrue() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false)
    }, 1000)
  }
}