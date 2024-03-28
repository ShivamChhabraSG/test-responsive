import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  loginurl = environment.url;
  constructor(private http: HttpClient, private router: Router,) { }
  userName:any
  Password:any;
  LeCode:any;
  RolesUrl:any;
  userToken:any;
  // public getloginDeatils(username:any,password:any,captcha:any,isLogout:boolean) {
  //   this.userToken = sessionStorage.getItem("UserToken");
  //   console.log("This.userToken",this.userToken)
  //  let options = {
  //    headers: new HttpHeaders({'Authorization': 'Bearer ' +this.userToken })
  //  };

  //   let body1 = new URLSearchParams();
  //   // body1.set("leCode",leCode)
  //   body1.set("username", username);
  //   body1.set("password", password);
  //   // let body = `${leCode}?emailId=${username}&password=${password}`;
  //   return this.http.post(this.loginurl + `users/login?username=${username}&password=${password}&captcha=${captcha}&isLogout=${isLogout}`, options)
  //   // return this.http.post(this.loginurl + `users/login`, body1, options)
  // }


  public getloginDeatils(username:any,password:any,captcha:any,isLogout:boolean) {
    this.userToken = sessionStorage.getItem("UserToken");
    console.log("This.userToken",this.userToken)
   let options = {
     headers: new HttpHeaders({ 'Content-Type': 'application/json',
     'Authorization': 'Bearer ' +this.userToken }),
     params: new HttpParams().set('isLogout', isLogout) 
   };
   const requestBody = {
    username: username,
    password: password,
    captcha: captcha
  };

    let body1 = new URLSearchParams();
    // body1.set("leCode",leCode)
    body1.set("username", username);
    body1.set("password", password);
    // let body = `${leCode}?emailId=${username}&password=${password}`;
    return this.http.post(this.loginurl + `users/loginV1`,requestBody, options)
    // return this.http.post(this.loginurl + `users/login`, body1, options)
  }

  forgetpassword(email:any) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(this.loginurl + `users/forgot-password?email=${email}`, options)
  }
  ValidateEmail(email:any,otp:any) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(this.loginurl + `users/validate-otp?email=${email}&otp=${otp}`, options)
  }
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = sessionStorage.getItem("UserToken");
    if (idToken) {
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Bearer " + idToken)
        });

        return next.handle(cloned).pipe( tap(() => {},
        (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
           return;
          }
          this.router.navigate(['home']);
        }
      }))
    }
    else {
        return next.handle(req);
    }
}
  resetPassword(userId:any,password:any) {
     this.userToken = sessionStorage.getItem("UserToken");
     let encodedURL = encodeURIComponent(password);
     console.log("This.userToken",this.userToken)
    let options = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' +this.userToken })
    };
    const requestBody = {
      userId: userId,
      password: password,
    };
    return this.http.post(this.loginurl + `users/reset-passwordV1`,requestBody, options)
  }
  getRoles(leCode:any) {
     this.userToken = sessionStorage.getItem("UserToken");
    console.log("This.userToken",this.userToken);
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.userToken })
   };
    return this.http.get(this.loginurl + `roles`, options)
  }
  selectRole(selectedRole:any) {
    this.userToken = sessionStorage.getItem("UserToken");
    console.log("This.userToken",this.userToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.userToken })
   };
   return this.http.post(this.loginurl + `users/select_role?roleCode=${selectedRole}`, options)
  }
}

