import { Injectable } from '@angular/core';
import { catchError, mapTo, of, Subject, tap, throwError } from 'rxjs';
import { Sauce } from '../models/Sauce.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaucesService {

  sauces$ = new Subject<Sauce[]>();

  constructor(private http: HttpClient,
              private auth: AuthService) {}

  getSauces() {
    this.http.get<Sauce[]>('http://localhost:3000/api/sauces').pipe(
      tap(sauces => this.sauces$.next(sauces)),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
  }

  getSauceById(id: string) {
    return this.http.get<Sauce>('http://localhost:3000/api/sauces/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  likeSauce(id: string, like: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/sauces/' + id + '/like',
      { userId: this.auth.getUserId(), like: like ? 1 : 0 }
    ).pipe(
      mapTo(like),
      catchError(error => throwError(error.error.message))
    );
  }

  dislikeSauce(id: string, dislike: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/sauces/' + id + '/like',
      { userId: this.auth.getUserId(), like: dislike ? -1 : 0 }
    ).pipe(
      mapTo(dislike),
      catchError(error => throwError(error.error.message))
    );
  }

  createSauce(sauce: Sauce, image: File) {
    const formData = new FormData();
    formData.append('sauce', JSON.stringify(sauce));
    formData.append('image', image);
    return this.http.post<{ message: string }>('http://localhost:3000/api/sauces', formData).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  modifySauce(id: string, sauce: Sauce, image: string | File) {
    if (typeof image === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/sauces/' + id, sauce).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('sauce', JSON.stringify(sauce));
      formData.append('image', image);
      return this.http.put<{ message: string }>('http://localhost:3000/api/sauces/' + id, formData).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }

  deleteSauce(id: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/sauces/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }
}
