import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Database, onValue, ref as dbRef } from '@angular/fire/database';
import { Storage, getDownloadURL, ref as storageRef} from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { set } from 'firebase/database';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular'
import { environment } from 'src/environments/environment';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { concatMapTo } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule, RecaptchaFormsModule]
})
export class LoginComponent  implements OnInit {
  is_demo: boolean = false
  key: string = ''
  token: string = ''
  name: string = ''
  location: string|null = ''
  form_token: string|undefined

  database: Database = inject(Database)
  storage: Storage = inject(Storage)
  industries: any = []
  siteKey: any = environment.siteKey
  isElectron: boolean = true

  constructor(private router: Router, public platform: Platform) {
    this.form_token = undefined
  }

  ngOnInit() {
    if(!this.platform.is('electron')) this.isElectron = false
    this.getIndustries()
    let localIndustries: any = localStorage.getItem('industries')
    if(localIndustries != null && localIndustries != undefined && localIndustries != '' && localIndustries != '[]') {
      localIndustries = JSON.parse(localIndustries as string)
      if(localIndustries.length >= 2) this.router.navigate(['/home'])
    }
  }

  async getIndustries() {
    const dataRef = dbRef(this.database, '/')
    onValue(dataRef, async (snapshot) => {
      if (snapshot.exists()) {
        this.industries = Object.entries(snapshot.val()).map(([key, value]: any) => ({key, ...value}))
      }
    })
  }

  onSubmit(event: Event) {
    event.preventDefault()
    console.log(this.form_token)
    if((this.form_token !== undefined && this.form_token !== null) || this.isElectron !== false) {
      let industry = this.industries.find((item: any) => item.profile.key == this.key && item.profile.token == this.token)
      if (industry != null && industry != undefined) {
        let localIndustries: any = localStorage.getItem('industries')
        let industryData = {
          token: this.token,
          key: this.key
        }
        if (localIndustries != null && localIndustries != undefined && localIndustries != '') {
          localIndustries = JSON.parse(localIndustries as string)
          if (localIndustries.length > 0) {
            localIndustries.map((item: any, index: number) => {
              if(item.key != this.key) {
                localIndustries.push(industryData)
                industryData = localIndustries
              }
            });
          } else {
            localIndustries = industryData
          }
        }
        localStorage.setItem('industries', JSON.stringify(industryData))
        setTimeout(() => {
          this.router.navigate(['/home']).then(() => window.location.reload())
        }, 250)
      }
    }
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  onSubmitDemo(event: Event) {
    event.preventDefault()
    if((this.form_token !== undefined && this.form_token !== null) || this.isElectron !== false) {
      const key = this.makeid(6)
      const token = this.makeid(42)
      let path = '/'+this.name.toString().toLowerCase().replace(' ', '-')
      let dataRef = dbRef(this.database, path)
      let profile: any =  {
        profile: {
          access: {
            communications: {
              lan: true,
              lora: false,
              wifi: true,
              usb: true
            },
            device: 3,
            actuator: 3,
            sensor: 3,
          },
          is_demo: true,
          level: 1,
          location: {
            name: this.location
          },
          logo: 'dev.png',
          name: this.name,
          key: key,
          token: token,
        }
      }
      set(dataRef, profile)
      let industryData = {
        token: token,
        key: key
      }
      let localIndustries: any = localStorage.getItem('industries')
      if (localIndustries != null && localIndustries != undefined && localIndustries != '') {
        localIndustries = JSON.parse(localIndustries)
        localIndustries.map((item: any, index: number) => {
          if(item.key != this.key) {
            localIndustries.push(industryData)
            console.log(localIndustries)
          }
        });
      } else {
        localIndustries = [industryData]
      }
      localStorage.setItem('industries', JSON.stringify(localIndustries))
      setTimeout(() => {
        this.router.navigate(['/home']).then(() => window.location.reload())
      }, 250)
    }
  }

  resolvedCaptcha(token: any) {
    this.form_token = token;
    console.log(token)
  }
}
