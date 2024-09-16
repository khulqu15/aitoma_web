import { AfterViewInit, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';
import { Database, ref as dbRef, onValue, push, set, remove } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { UsbSerial } from 'usb-serial-plugin'
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})
export class DevicesPage implements OnInit, AfterViewInit {
  database: Database = inject(Database)
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  mainPath: string = 'hayago/devices'
  data: any = []
  selectedData: any = null
  serials: any = []
  // form
  name: string = ''
  location: string = ''
  ports: any = []
  industry: any = null
  selectedIndustry: number = 0
  selectedCommunication: string = 'wifi'
  show_password: false
  wifi: any = {
    ssid: null,
    password: null,
    ip: null,
    ip_pc: null,
    active: true,
  }
  lan: any = {
    mac: null,
    ip_lan: null,
    subnet: null,
    ip_gateway: null,
    active: false,
  }
  usb: any = {
    com: null,
    baudrate: '115200',
    active: false,
  }
  lora: any = {
    address: null,
    frequency: '915E6',
    active: false,
  }
  isWeb: boolean = false
  isMobile: boolean = false
  isDesktop: boolean = false

  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, public platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('mobileweb')) this.isWeb = true
    if(this.platform.is('android') || this.platform.is('ios') || this.platform.is('mobile') || this.platform.is('iphone')) this.isMobile = true
    if(this.platform.is('electron')) this.isMobile = true
    let sessionUser: any = sessionStorage.getItem('user')
    if(sessionUser == null || sessionUser == undefined || sessionUser == '') this.router.navigate(['/login']).then(() => window.location.reload())
    else {
      let localIndustry = localStorage.getItem('industries')
      if(localIndustry != null && localIndustry != undefined && localIndustry != '') {
        let localTheme: string = localStorage.getItem('theme') || 'dark'
        let localLanguage: any = localStorage.getItem('language') || 1
        localLanguage = parseInt(localLanguage)
        if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
        if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
        this.selectedIndustry = parseInt(localStorage.getItem('selected_industry')!) || 0
        this.searchIndustries()
      } else {
        this.router.navigate(['/pricing'])
      }
    }
  }

  selectCom(com: string) {
    this.selectedCommunication = com
    this.wifi.active = false
    this.lora.active = false
    this.lan.active = false
    this.usb.active = false
    if(com == 'wifi') this.wifi.active = true
    if(com == 'lora') this.lora.active = true
    if(com == 'lan') this.lan.active = true
    if(com == 'usb') this.usb.active = true
  }

  searchIndustries() {
    let industryRef = dbRef(this.database, '/')
    onValue(industryRef, (snapshot) => {
      if(snapshot.exists()) {
        let industries = Object.entries(snapshot.val()).map(([key, value]: any) => ({ key, ...value }))
        let localIndustries = JSON.parse(localStorage.getItem('industries') as string)
        let checkIndustry = industries.find((item: any) => item.profile.key = localIndustries[this.selectedIndustry].key && item.profile.token == localIndustries[this.selectedIndustry].token)
        if(checkIndustry != null && checkIndustry != undefined) {
          this.industry = checkIndustry
          this.mainPath = this.industry.key+'/devices'
          this.getData()
        } else {
          this.router.navigate(['/pricing'])
        }
      } else {
        this.router.navigate(['/pricing'])
      }
    })
  }

  ngAfterViewInit(): void {
    this.getSerialPorts()
  }

  async getSerialPorts(): Promise<void> {
    try {
      const ports = UsbSerial.connectedDevices()
      console.log(ports)
    } catch(error) {
      console.log(error)
    }
  }

  async getData() {
    try {
      const dataRef = dbRef(this.database, this.mainPath)
      onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          this.data = Object.entries(snapshot.val()).map(([key, value]: any) => ({key, ...value}))
          console.log(this.data)
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  async onSubmit() {
    try {
      let port: string = ''
      if(this.wifi.active) port = this.wifi.ssid
      if(this.usb.active) port = this.usb.port
      if(this.lora.active) port = this.lora.address
      if(this.lan.active) port = this.lan.ip_gateway
      let concatDot = port.length >= 5 ? '..' : ''
      port = port.substring(0, 5) + concatDot
      let now: Date = new Date()
      var datetime = now.getDate() + '/' + (now.getMonth()+1) + '/' +now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes()
      const data =  {
        name: this.name,
        location: this.location,
        battery: 0,
        port: port,
        created_at: datetime,
        communications: {
          wifi: this.wifi,
          lora: this.lora,
          usb: this.usb,
          lan: this.lan
        }
      }
      let keyData = this.data.length
      if(this.selectedData != null) keyData = this.data[this.selectedData].key
      const dataRef = dbRef(this.database, this.mainPath + '/' + keyData)
      set(dataRef, data)
      document.getElementById('form_modal')?.click()
    } catch(error) {
      console.log(error)
    }
  }

  deleteDevice() {
    const dataRef = dbRef(this.database, this.mainPath + '/' + this.selectedData)
    remove(dataRef)
    document.getElementById('delete_modal')?.click()
  }

  async setData(index: any) {
    this.selectedData = index
    if(index == null) {
      this.name = ''
      this.location = ''
      this.wifi.ssid = ''
      this.wifi.password = ''
      this.wifi.ip = ''
      this.wifi.ip_pc = ''
      this.wifi.active = true
      this.lan.mac = ''
      this.lan.ip_lan = ''
      this.lan.ip_gateway = ''
      this.lan.subnet = ''
      this.lan.active = false
      this.usb.com = ''
      this.usb.baudrate = '115200'
      this.usb.active = false
      this.lora.address = ''
      this.lora.frequency = '915E6'
      this.lora.active = false
    } else {
      this.name = this.data[index].name
      this.location = this.data[index].location
      this.wifi.ssid = this.data[index].communications.wifi.ssid || ''
      this.wifi.password = this.data[index].communications.wifi.password || ''
      this.wifi.ip = this.data[index].communications.wifi.ip || ''
      this.wifi.ip_pc = this.data[index].communications.wifi.ip_pc || ''
      this.wifi.active = this.data[index].communications.wifi.active || true
      this.lan.mac = this.data[index].communications.lan.mac || ''
      this.lan.ip_lan = this.data[index].communications.lan.ip_lan || ''
      this.lan.ip_gateway = this.data[index].communications.lan.ip_gateway || ''
      this.lan.subnet = this.data[index].communications.lan.subnet || ''
      this.lan.active = this.data[index].communications.lan.active || false
      this.usb.com = this.data[index].communications.usb.com || ''
      this.usb.baudrate = this.data[index].communications.usb.baudrate || '115200'
      this.usb.active = this.data[index].communications.usb.active || false
      this.lora.address = this.data[index].communications.lora.address || ''
      this.lora.frequency = this.data[index].communications.lora.frequency || '915E6'
      this.lora.active = this.data[index].communications.lora.active || false
    }
    if (this.wifi.active) this.selectedCommunication = 'wifi'
    if (this.lora.active) this.selectedCommunication = 'lora'
    if (this.usb.active) this.selectedCommunication = 'usb'
    if (this.lan.active) this.selectedCommunication = 'lan'
  }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }
}
