import { Injectable } from '@angular/core';
import { ResultItem } from '../interfaces/result.interface';

@Injectable({
  providedIn: 'root'
})
export class DataControlService {
  showPartnersRequest: boolean = false;
  myInitiativesList = [];
  resultsList: ResultItem[];
  constructor() {}
  validateBody(body: any) {
    return Object.entries(body).every((item: any) => item[1]);
  }
  myInitiativesListText(initiatives) {
    let result = '';
    initiatives?.map((item, index) => {
      result += item.name + (index + 1 < initiatives?.length ? ', ' : '');
    });
    return result;
  }

  listenTextTenSeconds(text) {
    let seconds = 0;
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        console.log('sdsd  ' + seconds);
        seconds++;
        if (text) {
          resolve(text);
        }
        if (seconds == 10) {
          clearInterval(timer);
          reject('error');
        }
      }, 1000);
    });
  }

  async findClassTenSeconds(className) {
    let seconds = 0;
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        console.log('sdsd  ' + seconds);
        seconds++;
        if (document.querySelector(`.${className}`)) {
          console.log('finded');
          resolve(document.querySelector(`.${className}`));
          clearInterval(timer);
        }
        if (seconds == 10) {
          clearInterval(timer);
          reject('error');
        }
      }, 1000);
    });
  }
}
