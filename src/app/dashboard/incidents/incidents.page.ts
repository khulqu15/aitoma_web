import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';
import { Database, ref as dbRef, onValue, remove, set } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})
export class IncidentsPage implements OnInit {
  database: Database = inject(Database)
  constructor(private router: Router, private renderer: Renderer2) { }
  data: any = []
  industry: any = null
  currentTheme: string = 'dark'
  selectedIndustry: any = 0
  selectedLanguage: any = 0

  mainPath: string = 'hayago/incidents'
  selectedData: any = null
  title: string = ''
  subtitle: string = ''
  location: string = ''
  date: string = ''
  time: string = ''
  link: string = ''

  ngOnInit() {
    this.getData()
    let sessionUser: any = sessionStorage.getItem('user')
    if(sessionUser == null || sessionUser == undefined || sessionUser == '') this.router.navigate(['/login']).then(() => window.location.reload())
    else {
      let localIndustry = localStorage.getItem('industries')
      if(localIndustry != null && localIndustry != undefined && localIndustry != '') {
        this.industry = JSON.parse(localIndustry)
        let localTheme: string = localStorage.getItem('theme') || 'dark'
        let localLanguage: any = localStorage.getItem('language') || 1
        localLanguage = parseInt(localLanguage)
        if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
        if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
        this.selectedIndustry = parseInt(localStorage.getItem('selected_industry')!) || 0
        localStorage.setItem('selected_industry', this.selectedIndustry.toString())
        this.searchIndustries()
      } else {
        this.router.navigate(['/pricing'])
      }
    }
  }

  searchIndustries() {
    let industryRef = dbRef(this.database, '/')
    onValue(industryRef, (snapshot) => {
      if(snapshot.exists()) {
        let industries = Object.entries(snapshot.val()).map(([key, value]: any) => ({ key, ...value }))
        let localIndustries = JSON.parse(localStorage.getItem('industries') as string)
        console.log(localIndustries[this.selectedIndustry])
        let checkIndustry = industries.find((item) => item.profile?.key == localIndustries[this.selectedIndustry].key && item.profile?.token == localIndustries[this.selectedIndustry].token)
        if(checkIndustry != null && checkIndustry != undefined) {
          this.industry = checkIndustry
          console.log(this.industry)
          this.mainPath = this.industry.key + '/incidents'
        } else {
          localStorage.removeItem('industries')
          this.router.navigate(['/pricing'])
        }
        this.getData()
      }
    })
  }


  async getData() {
    try {
      const dataRef = await dbRef(this.database, this.mainPath)
      onValue(dataRef, (snapshot) => {
        if(snapshot.exists()) {
          this.data = Object.entries(snapshot.val()).map(([key, value]: any) => ({ key, ...value }))
          this.data.forEach((item: any, index: number) => {
            const timestamp = this.data[index].timestamp
            const date = new Date(timestamp)
            const day = date.getUTCDate()
            const month = date.getUTCMonth()
            const year = date.getUTCFullYear()
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            this.data[index].timestamp = `${day}-${month}-${year} ${hours}:${minutes}`
          })
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  setSelect(index: any) {
    this.selectedData = index
    if(index == null) {
      this.title = ''
      this.subtitle = ''
      this.location = ''
      this.date = ''
      this.time = ''
      this.link = ''
    } else {
      this.title = this.data[index].title
      this.subtitle = this.data[index].subtitle
      this.location = this.data[index].location
      this.link = this.data[index].link
      const timestamp = this.data[index]?.timestamp
      const date = new Date(timestamp)
      console.log(timestamp)
      if (timestamp) {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          this.date = date.toISOString().substring(0, 10);
          this.time = date.toISOString().substring(11, 16);
        } else {
          console.warn('Invalid date:', timestamp);
          this.date = '';
          this.time = '';
        }
      } else {
        console.warn('No timestamp provided');
        this.date = '';
        this.time = '';
      }
    }
  }

  onSubmit() {
    let pathRef = this.mainPath+'/'+this.data.length
    if (this.selectedData != null) {
      pathRef = this.mainPath+'/'+this.selectedData
    }
    const dataRef = dbRef(this.database, pathRef)
    const dateString = `${this.date}T${this.time}:00Z`
    const timestamp = new Date(dateString).toISOString()
    set(dataRef, {
      title: this.title,
      subtitle: this.subtitle,
      location: this.location,
      timestamp: timestamp,
    }).then(() => {
      console.log('Success')
    })
    document.getElementById('form_modal')?.click()
  }

  onDelete() {
    const dataRef = dbRef(this.database, this.mainPath+'/'+this.selectedData)
    remove(dataRef).then(() => {
      document.getElementById('delete_modal')?.click();
      window.location.reload()
    }).catch((error) => {
      console.error('Error deleting data:', error);
    });
    document.getElementById('delete_modal')?.click()
  }
}
