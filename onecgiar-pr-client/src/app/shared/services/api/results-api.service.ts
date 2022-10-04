import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultsApiService {
  constructor(public http: HttpClient) {}

  getAllResultLevel() {
    return this.http.get<any>(`${environment.apiBaseUrl}results/result-levels/all`);
  }
}
