import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LogoutServiceService {
  logouturl = environment.url;
  constructor(private http: HttpClient) { }
  userToken:any;
  logout() {

    // http://162.222.206.90:8081/api/users/logout
     this.userToken = sessionStorage.getItem("UserToken");
    //  alert(this.userToken)
     console.log("This.userToken",this.userToken)
    let options = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' +this.userToken })
    };
    return this.http.post(this.logouturl + `users/logout`, options)
  }
  // this.router.navigate(['login']);
}

