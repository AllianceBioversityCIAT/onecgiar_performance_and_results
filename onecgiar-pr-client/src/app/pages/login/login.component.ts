import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAuth } from '../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { internationalizationData } from '../../shared/data/internationalizationData';
import { AuthService } from '../../shared/services/api/auth.service';
import { CustomizedAlertsFeService } from '../../shared/services/customized-alerts-fe.service';
import { RolesService } from 'src/app/shared/services/global/roles.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy, OnInit {
  internationalizationData = internationalizationData;
  userLoginData = new UserAuth();
  successLogin = false;
  constructor(private authService: AuthService, private customAlertService: CustomizedAlertsFeService, private router: Router, private rolesSE: RolesService) {
    this.authService.inLogin = true;
    if (!!this.authService.localStorageUser) this.router.navigate(['/']);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    document.getElementById('password').addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        document.getElementById('login').click();
        document.getElementById('password').blur();
        document.getElementById('fake').focus();
      }
    });
  }

  onLogin() {
    this.authService.userAuth(this.userLoginData).subscribe(
      resp => {
        const { token, user } = resp?.response;
        this.authService.localStorageToken = token;
        this.authService.localStorageUser = user;
        this.successLogin = true;
        setTimeout(() => {
          this.router.navigate(['/']);
          this.rolesSE.validateReadOnly();
        }, 1500);
      },
      err => {
        const statusCode = err?.error?.statusCode;
        const alertText = this.internationalizationData.login.alerts[statusCode];
        if (statusCode == 404)
          return this.customAlertService.show({ id: 'loginAlert', title: 'Oops!', description: alertText, status: 'warning', confirmText: 'Contact us' }, () => {
            document.getElementById('question').click();
            this.customAlertService.closeAction('loginAlert');
          });

        this.customAlertService.show({ id: 'loginAlert', title: 'Oops!', description: alertText, status: 'warning' });
      }
    );
  }

  ngOnDestroy(): void {
    this.authService.inLogin = false;
  }
  display: boolean = false;
}
