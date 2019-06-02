import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, of, } from 'rxjs';
import { catchError, switchMap, flatMap } from 'rxjs/operators';
import { UserHttpService } from './user-http.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  private base_url = environment.base_url;

  constructor(private us : UserHttpService, private http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) :Observable<HttpEvent<any>> {  
    console.log("Richiesta intercettata :"  + req.url);

    let token = this.us.get_token();

    /*if(token) {
      
    }*/

    const effReq = req.clone({
      url: this.base_url + req.url,
      headers: ((req.url !== "login") ? req.headers.set("authorization", 'Bearer ' + this.us.get_token())
      .set('Content-Type', 'application/json') : req.headers.set('Content-Type', 'application/x-www-form-urlencoded')).set("cache-control", "no-cache")
    });

    return next.handle(effReq)/*.pipe(
      catchError((err : HttpErrorResponse) => {
        console.log(err.error);
        if(err.status == 401 && err.error.message == "jwt expired")
          return this.us.renew()
            .pipe(
            switchMap((res) => {
              console.log(res);
              console.log(this.us.get_token());
              if(res.status == 200)
                return next.handle(effReq);
              else this.us.logout();
            })
          );
        return Observable.throw(err);
      })
    )*/;   
  }
}
