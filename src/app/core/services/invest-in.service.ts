import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/general.response';
import { Logger } from './logger.service';
import { Feed } from '../models/feed.model';
import { catchError } from 'rxjs/operators';

const Logging = new Logger('QnaService');

@Injectable({
  providedIn: 'root',
})
export class InvestInService {
  private defaultUrl: string = environment['apiUrl'];

  constructor(private http: HttpClient) {}

  createTheamData = (data:any): Observable<any> => {
    const apiUrl = environment.apiUrl + 'admin/collegeyInInvest/addData';
    return this.http.post(apiUrl, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getAllData = (data: any): Observable<any> => {
    const apiUrl = environment.apiUrl + 'admin/collegeyInInvest/getAllData';
    return this.http.get(apiUrl, { params: data }).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateTheamData = (data: any, Id: any): Observable<any> => {
    let apiUrl = environment.apiUrl + 'admin/collegeyInInvest/updateData/' + Id;
    return this.http.put(apiUrl, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
}
