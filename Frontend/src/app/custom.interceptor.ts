import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localToken = localStorage.getItem('token');
    let clonedReq = req;

    if (localToken) {
      clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${localToken}`)
      });
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if(error.error){

          }else{
            localStorage.removeItem('token');
            window.location.reload();
          }
         
        }
        
        return throwError(() => new Error(error.message));
      })
    );
  }
}

