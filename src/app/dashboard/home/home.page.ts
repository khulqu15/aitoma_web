import { AfterViewInit, Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from "../../components/dashboard/menu/menu.component";
import { Database, ref as dbRef, onValue } from '@angular/fire/database';
import { LoginComponent } from 'src/app/components/dashboard/login/login.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent, LeafletModule, LoginComponent]
})

export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('chart1') private chart1: any
  @ViewChild('chart2') private chart2: any
  @ViewChild('oee_summary') private oee_summary: any
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  database: Database = inject(Database)
  safeUrlLoaded: boolean = false
  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }
  incidents: any = []
  location: any = {lat: 0, lon: 0, iframe: ''}
  safeUrl: SafeResourceUrl
  map: L.Map | undefined;
  industry: any = null
  selectedIndustry: number = 0
  chartTitle1: string = ''
  chartTitle2: string = ''

  countingReports: any = [
    { total: 0, label: {0: 'Insiden', 1: 'Incidents', 2: '事件'}, sublabel: 'This weeks' },
    { total: 0, label: {0: 'Perangkat', 1: 'Devices', 2: 'デバイス'}, sublabel: 'Online' },
    { total: 0, label: {0: 'Sensor', 1: 'Sensors', 2: 'センサー'}, sublabel: 'Offline' },
    { total: 0, label: {0: 'Aktuator', 1: 'Actuators', 2: 'アクチュエータ'}, sublabel: 'Offline' },
  ]

  async ngOnInit() {
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
        let checkIndustry = industries.find((item) => item.profile.key = localIndustries[this.selectedIndustry].key && item.profile.token == localIndustries[this.selectedIndustry].token)
        if(checkIndustry != null && checkIndustry != undefined) {
          this.industry = checkIndustry
        } else {
          // localStorage.removeItem('industries')
          // this.router.navigate(['/pricing'])
        }
        this.getIncidents()
        this.initMap()
        this.chartData()
      }
    })
  }

  ngAfterViewInit() {
  }

  chartData() {
    const formatTimestamp = (timestamp: string) => {
      let [datePart, timePart] = timestamp.split(' ');
      let [day, month, year] = datePart.split('/').map(Number); // Split the date and convert to numbers
      let [hours, minutes] = timePart.split(':').map(Number); // Split the time and convert to numbers

      // Create a new Date object (month is 0-indexed, so subtract 1 from the month)
      let date = new Date(year, month - 1, day, hours, minutes);
      return date.toLocaleDateString()
      // return timestamp
      // return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    }
    if(this.industry.devices != null) {
      if(this.industry.devices[0].sensors != null) {
        if(this.industry.devices[0].sensors.length >= 1) {
          let devices1 = this.industry.devices[0].sensors
          this.chartTitle1 = this.industry.devices[0].name
          console.log(this.chartTitle1)
          let labels1: any = []
          let datasets1: any = []

          devices1.forEach((item: any, index: number) => {
            item.logs.forEach((log: any, log_index: number) => {
              let shortTimestamp = formatTimestamp(log.timestamp)
              if(!labels1.includes(shortTimestamp)) labels1.push(shortTimestamp)
            })
          })
          labels1.sort((a: any, b: any) => {
            const [aHours, aMinutes] = a.split(':').map(Number);
            const [bHours, bMinutes] = b.split(':').map(Number);
            return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
          });
          devices1.forEach((item: any, index: number) => {
            let tempValue = new Array(labels1.length).fill(null)
            item.logs.forEach((log_data: any, log_index: number) => {
              let shortTimestamp = formatTimestamp(log_data.timestamp)
              let idx = labels1.indexOf(shortTimestamp)
              if(idx !== -1) tempValue[idx] = log_data.value
            })
            datasets1.push({
              label: item.name,
              data: tempValue,
              borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
              fill: false
            })
          })
          setTimeout(() => {
            this.chart1 = new Chart(this.chart1.nativeElement, {
              type: 'line',
              data: {
                labels: labels1,
                datasets: datasets1
              }
            })
            console.log(this.chart1)
          }, 200)
        }

        if(this.industry.devices.length >= 2) {
          let devices2 = this.industry.devices[1].sensors
          this.chartTitle2 = this.industry.devices[1].name
          let labels2: any = []
          let datasets2: any = []

          if(this.industry.devices[1].sensors.length > 0) {
            devices2.forEach((item: any, index: number) => {
              item.logs.forEach((log: any, log_index: number) => {
                let shortTimestamp = formatTimestamp(log.timestamp)
                if(!labels2.includes(shortTimestamp)) labels2.push(shortTimestamp)
              })
            })
            labels2.sort((a: any, b: any) => {
              const [aHours, aMinutes] = a.split(':').map(Number);
              const [bHours, bMinutes] = b.split(':').map(Number);
              return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
            });
            devices2.forEach((item: any, index: number) => {
              let tempValue = new Array(labels2.length).fill(null)
              item.logs.forEach((log_data: any, log_index: number) => {
                let shortTimestamp = formatTimestamp(log_data.timestamp)
                let idx = labels2.indexOf(shortTimestamp)
                if(idx !== -1) tempValue[idx] = log_data.value
              })
              datasets2.push({
                label: item.name,
                data: tempValue,
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                fill: false
              })
            })
            setTimeout(() => {
              console.log(this.chart2)
              this.chart2 = new Chart(this.chart2.nativeElement, {
                type: 'line',
                data: {
                  labels: labels2,
                  datasets: datasets2
                }
              })
            }, 300)
          }
        }
        let oee = this.industry.devices[0].oee
        if(oee != null && oee != undefined) {
          this.oee_summary = new Chart(this.oee_summary.nativeElement, {
            type: 'bar',
            data: {
              labels: ['Perform', 'Availa', 'Quality'],
              datasets: [
                {
                  label: 'OEE(%)',
                  data: [oee.performance, oee.availability, oee.quality],
                  backgroundColor: 'rgba(46, 55, 255, 0.2)',
                  borderColor: 'rgba(46, 55, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 2
                }
              ]
            }
          })
        }
      }
    }
  }

  async initMap() {
    try {
      await this.getLocation()
      // this.map = L.map('map', {
      //   center: [this.location.lat, this.location.lon],
      //   zoom: 12
      // })
      // L.marker([this.location.lat, this.location.lon]).addTo(this.map)
      // .openPopup();
    } catch(error) {
      console.log(error)
    }
  }

  async getLocation() {
    try {
      const locationRef = await dbRef(this.database, this.industry.key+'/profile/location')
      onValue(locationRef, (snapshot) => {
        if (snapshot.exists()) {
          this.location.lon = snapshot.val().lon
          this.location.lat = snapshot.val().lat
          this.location.map = snapshot.val().map
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.location.map);
          this.safeUrlLoaded = true
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  async getIncidents() {
    try {
      const incidentRef = await dbRef(this.database, this.industry.key+'/incidents')
      onValue(incidentRef, (snapshot) => {
        if(snapshot.exists()) {
          const data = snapshot.val()
          this.incidents = this.formatTimestamps(data)
          this.countingReports[0].total = this.incidents.length
        }
      })
      const devicesRef = await dbRef(this.database, this.industry.key+'/devices')
      onValue(devicesRef, (snapshot) => {
        if(snapshot.exists()) {
          let count_actuators = 0
          let count_sensors = 0
          const data = snapshot.val()
          this.countingReports[1].total = data.length
          for(let i = 0; i < data.length; i++) {
            if(data[i].actuators != null) count_actuators += data[i].actuators.length
            if(data[i].sensors != null) count_sensors += data[i].sensors.length
          }
          this.countingReports[2].total = count_sensors
          this.countingReports[3].total = count_actuators
        }
      })

    } catch(error) {
      console.log(error)
    }
  }

  formatTimestamps(data: any): any {
    return Object.keys(data).map(key => {
      const incident = data[key];
      const date = new Date(incident.timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      incident.timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;
      return incident;
    });
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

}
