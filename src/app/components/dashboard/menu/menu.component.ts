import { Component, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Database, ref as dbRef, onValue, remove, set } from '@angular/fire/database';
import { Storage, getDownloadURL, ref as storageRef} from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class MenuComponent  implements OnInit {
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  @Input() menu_active: string = ''
  industries: any = []
  loading: boolean = true
  selectedIndustry: number = 0
  selectedData: number = 0
  copiedButton: any = null

  name: string = ''
  location: string = ''

  menu: any = [
    { 0: 'Dasbor', 1: 'Dashboard', 2: 'ダッシュボード' },
    { 0: 'Perangkat', 1: 'Devices', 2: 'デバイス' },
    { 0: 'Aktuator', 1: 'Actuators', 2: 'アクチュエーター' },
    { 0: 'Sensor', 1: 'Sensors', 2: 'センサー' },
    { 0: 'Kondisi', 1: 'Conditions', 2: '条件' },
    { 0: 'Lembar Data', 1: 'Datasheets', 2: 'データシート' },
    { 0: 'Insiden', 1: 'Incidents', 2: '事件' },
  ]
  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute) { }
  database: Database = inject(Database)
  storage: Storage = inject(Storage)

  ngOnInit() {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: any = localStorage.getItem('language') || 1
    localLanguage = parseInt(localLanguage)
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    setTimeout(() => {
      this.getIndustries()
      this.selectedIndustry = parseInt(localStorage.getItem('selected_industry') as string)
    }, 250)
  }

  async getIndustries() {
    const dataRef = dbRef(this.database, '/')
    await onValue(dataRef, async (snapshot) => {
      if (snapshot.exists()) {
        let listIndustries = Object.entries(snapshot.val()).map(([key, value]: any) => ({key, ...value}))
        let localIndustries = JSON.parse(localStorage.getItem('industries') as string)
        this.industries = []
        for(let j = 0; j < localIndustries.length; j++) {
          let checkIndustry = listIndustries.find((item) => item.profile?.key == localIndustries[j].key && item.profile?.token == localIndustries[j].token)
          if(checkIndustry != null && checkIndustry != undefined) {
            this.industries.push(checkIndustry)
          }
        }

        for (let industry of this.industries) {
          let imgRef = storageRef(this.storage, 'industries/'+industry.profile.logo)
          try {
            industry.profile.logo = await getDownloadURL(imgRef)
          } catch(error) {
            imgRef = storageRef(this.storage, 'industries/dev.png')
            console.error("Error fetching image:", error);
            industry.profile.logo = await getDownloadURL(imgRef)
          }
        }
        this.loading = false
      }
    })
  }

  async editIndustry(index: number) {
    this.selectedData = index
    let localIndsutriesData: any = localStorage.getItem('industries')
    if(localIndsutriesData != null && localIndsutriesData != undefined && localIndsutriesData != '' && localIndsutriesData != '[]') {
      let industryRef = dbRef(this.database, '/')
      await onValue(industryRef, (snapshot) => {
        if(snapshot.exists()) {
          let listIndustries = Object.entries(snapshot.val()).map(([key, value]: any) => ({key, ...value}))
          let localIndsutries = JSON.parse(localIndsutriesData as string)
          let checkIndustry = listIndustries.find((item) => item.profile.key == localIndsutries[index].key && item.profile.token == localIndsutries[index].token)
          console.log(localIndsutries[index])
          if(checkIndustry != null && checkIndustry != undefined) {
            this.name = checkIndustry.profile.name
            this.location = checkIndustry.profile.location.name
            document.getElementById('edit_modal')?.click()
          }
        }
      })
    }
  }

  async updateIndustry(event: Event) {
    event.preventDefault()
    let localstorageIndustry: any = localStorage.getItem('industries')
    if(localstorageIndustry != null && localstorageIndustry != undefined && localstorageIndustry != '' && localstorageIndustry != '[]') {
      console.log(localstorageIndustry)
      let localIndsutries = JSON.parse(localstorageIndustry as string)
      let industryRef = dbRef(this.database, '/')
      await onValue(industryRef, (snapshot) => {
        if(snapshot.exists()) {
          let listIndustries: any = Object.entries(snapshot.val()).map(([key, value]: any) => ({key, ...value}))
          let checkIndustry = listIndustries.find((item: any) => item.profile.key == localIndsutries[this.selectedData].key && item.profile.token == localIndsutries[this.selectedData].token)
          if(checkIndustry != null && checkIndustry != undefined) {
            let nameRef = dbRef(this.database, '/'+checkIndustry.key+'/profile/name')
            set(nameRef, this.name)
            let locationRef = dbRef(this.database, '/'+checkIndustry.key+'/profile/location/name')
            set(locationRef, this.location)
            document.getElementById('edit_modal')?.click()
            console.log(this.name)
            console.log(this.location)
          }
        }
      })
    }
  }

  removeIndustry(index: number) {
    let localIndsutries = JSON.parse(localStorage.getItem('industries') as string)
    localIndsutries.splice(index, 1)
    if(localIndsutries.length == 0) localStorage.removeItem('industries')
    else localStorage.setItem('industries', JSON.stringify(localIndsutries))
    window.location.reload()
    let dataRef = dbRef(this.database, '/'+this.industries[index].key)
    remove(dataRef)
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  changeLanguage(option: number): void {
    this.selectedLanguage = option
    localStorage.setItem('language', this.selectedLanguage.toString());
    window.location.reload()
  }

  isMenuActive(menuKey: string): boolean {
    return this.menu_active === menuKey;
  }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }

  selectIndustry(index: number) {
    localStorage.setItem('selected_industry', index.toString())
    window.location.reload()
  }

  copyText(event: Event, text: string, copiedText: string) {
    this.copiedButton = copiedText
    navigator.clipboard.writeText(text)
    setTimeout(() => {
      this.copiedButton = null
    }, 500)
  }
}
