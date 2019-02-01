import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => {        
        resolve(userData.user.email);
      }, 
      err => reject(err))
    });
  }

  getAuth() {
    return this.afAuth.authState.pipe();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
