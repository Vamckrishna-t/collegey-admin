import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/general.response';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from './logger.service';
import { catchError } from 'rxjs/operators';


const Logging = new Logger('reviewService');


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private defaultUrl: string = environment['apiUrl'];
  constructor(private http: HttpClient) { }

  getReviewList(filter): Observable<any> {
    const apiUrl = this.defaultUrl + 'admin/review/';
    return this.http.get<ApiResponse>(apiUrl, {
      params: filter
    }).pipe(map((response) => {
      Logging.debug(response);
      return response;
    }));
  }

  createReview(formData): Observable<any> {
    const apiUrl = this.defaultUrl + 'admin/review/';
    return this.http.post<ApiResponse>(apiUrl, formData).pipe(map(response => {
      Logging.debug(response);
      return response;
    }));
  }


  getReviewInfo(reviewId): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/review/${reviewId}`;
    return this.http.get<ApiResponse>(apiUrl).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  updateReview(formData, id): Observable<any> {
    const apiUrl = `${this.defaultUrl}admin/review/${id}`;
    return this.http.patch<ApiResponse>(apiUrl, formData).pipe(
      map((response) => {
        Logging.debug(response);
        return response;
      })
    );
  }

  updateReviewTestimonialStatus = (data:any): Observable<any> => {
    const endpoint = environment.apiUrl+'admin/review/updateReviewTestimonialStatus';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  


}
