import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signInWithEmailAndPassword, Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth'
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  show_password: boolean = false
  email: string = ''
  password: string = ''
  auth: Auth = inject(Auth)
  isElectron: boolean = true

  constructor(private router: Router, public platform: Platform) { }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }

  ngOnInit() {
    if(!this.platform.is('electron')) this.isElectron = false
  }

  async loginWithGoogle(event: Event) {
    if(this.isElectron == false) {
      event.preventDefault()
      try {
        const provider = new GoogleAuthProvider()
        const user = await signInWithPopup(this.auth, provider)
        if (user.user) {
          sessionStorage.setItem('user', JSON.stringify(user.user))
        }
        this.navigatePush('/home')
      } catch(error) {
        console.log('Login failed: ', error)
      }
    }
  }

  async onLoginEmail(event: Event) {
    event.preventDefault()
    try {
      const user = await signInWithEmailAndPassword(this.auth, this.email, this.password)
      console.log('Login success: ')
      if (user.user) {
        sessionStorage.setItem('user', JSON.stringify(user.user))
      }
      this.navigatePush('/home')
    } catch (error) {
      console.log('Login failed: ', error)
    }
  }
}
