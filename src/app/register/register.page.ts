import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createUserWithEmailAndPassword, Auth, sendEmailVerification, updateProfile} from '@angular/fire/auth'
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  show_password: boolean = false
  name: string = ''
  email: string = ''
  password: string = ''
  re_password: string = ''

  auth: Auth = inject(Auth)
  firestore: Firestore = inject(Firestore)

  constructor(private router: Router) { }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }

  ngOnInit() {
  }

  async onRegisterEmail(event: Event) {
    event.preventDefault()
    try {
      if(this.password != this.re_password) {
        console.log('Password not same')
      }
      const user = await createUserWithEmailAndPassword(this.auth, this.email, this.password)
      console.log('Register success: ')
      if(user.user) {
        updateProfile(user.user, {
          displayName: this.name
        })
        await setDoc(doc(this.firestore, 'users', user.user.uid), {
          name: this.name,
          email: this.email,
          password: this.password
        })
        await sendEmailVerification(user.user)
        console.log('Verification email sent')
      }
      this.navigatePush('/login')
    } catch (error) {
      console.log('Login failed: ', error)
    }
  }
}
