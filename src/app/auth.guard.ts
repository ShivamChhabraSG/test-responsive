import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    // if (!this.authService.isAuthenticated()) {
    //   return this.router.parseUrl('/login');
    // }
  
    const key = next.data['key'];
    const restrictedRoute = '/restricted-route';

    if (state.url === restrictedRoute) {
      // Redirect the user to a different route or perform any other desired action.
      this.router.navigate(['/home']);
      return false;
    }
    if (sessionStorage.getItem('UserToken')) {
      // logged in so return true
      // return true;
      if (key == undefined) {
        return true;
      }

  }

  else{
    this.router.navigate(['/home']);
    return false
  }
  return false;


}
}
