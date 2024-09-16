import { AfterViewInit, Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';
import { Database, ref as dbRef, onValue, remove, set } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
import { Platform } from '@ionic/angular'
Chart.register(...registerables)

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})

export class DevicePage implements OnInit, AfterViewInit {
  database: Database = inject(Database)
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  mainPath: string = 'hayago/devices'
  data: any = []
  serials: any = []
  communicationSelected: string = 'wifi'
  showPassword: boolean = false
  loading: boolean = false

  industry: any = null
  selectedIndustry: number = 0
  selectedForm: string = 'sensor'
  selectedData: any = null
  selectedActuator: any = null
  selectedCondition: any = null

  // form
  wifi_ssid: string = ''
  wifi_password: string = ''
  wifi_ip: string = ''
  wifi_ip_pc: string = ''
  wifi_active: boolean = false

  lora_frequency: string = ''
  lora_address: string = ''
  lora_active: boolean = false

  usb_port: string = ''
  usb_active: boolean = false
  usb_baudrate: string = '115200'

  lan_subnet: string = ''
  lan_mac: string = ''
  lan_ip: string = ''
  lan_gateway: string = ''
  lan_active: boolean = false

  uid: any = ''
  interfaces: any = ['SPI', 'I2C', 'UART', 'MODBUS', 'CANBUS', 'USB', 'USB-SPI','ETHERNET RJ-45', 'RS-232']
  modules: any = ['INVERTER 1to3', 'ESC', 'BTS', 'BTN', 'LM']
  sensor: any = {
    name: '',
    location: '',
    threshold: {
      min: 0,
      mid: 5,
      max: 10,
    },
    interface: 'SPI',
    value: 0,
    unit: '%',
  }
  actuator: any = {
    name: '',
    location: '',
    threshold: {
      min: 0,
      max: 10,
    },
    module: 'ESC',
    value: 0,
  }

  condition_name: ''
  conditions: any = [
    {
      id: '',
      name: '',
      value: 0
    }
  ]
  actions: any = [
    {
      id: '',
      name: '',
      value: 0,
    }
  ]
  inverter: any = {
    pwm1: null,
    pwm2: null,
    en: null,
    fault: null
  }
  esc: any = {
    pwm: null,
  }
  bts: any = {
    in_a: null,
    in_b: null
  }
  lm: any = {
    inverting: null,
    non_inverting: null,
    output: null
  }
  spi: any = {
    mosi: null,
    miso: null,
    sck: null,
    ss: null
  }
  i2c: any = {
    sda: null,
    scl: null
  }
  uart: any = {
    rx: null,
    tx: null
  }
  modbus: any = {
    a: null,
    b: null
  }
  canbus: any = {
    canh: null,
    canl: null
  }
  usb: any = {
    dplus: null,
    dmin: null
  }
  usbspi: any = {
    mosi: null,
    miso: null,
    sck: null,
    ss: null,
    data: null,
  }
  rj45: any = {
    txplus: null,
    txmin: null,
    rxplus: null,
    rxmin: null
  }
  rs232: any = {
    tx: null,
    rx: null,
    rts: null,
    cts: null,
    dtr: null,
    dsr: null,
  }
  rs485: any = {
    a: null,
    b: null,
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
        this.uid = this.route.snapshot.paramMap.get('uid')
        this.mainPath = 'hayago/devices/'+this.uid
        this.searchIndustries()
        let localTheme: string = localStorage.getItem('theme') || 'dark'
        let localLanguage: any = localStorage.getItem('language') || 1
        localLanguage = parseInt(localLanguage)
        if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
        if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
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
        let checkIndustry = industries.find((item: any) => item.profile.key = localIndustries[this.selectedIndustry].key && item.profile.token == localIndustries[this.selectedIndustry].token)
        if(checkIndustry != null && checkIndustry != undefined) {
          this.industry = checkIndustry
          this.mainPath = this.industry.key+'/devices/'+this.uid
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

  }

  setData(path: string, value: any) {
    const dataRef = dbRef(this.database, this.mainPath+path)
    set(dataRef, value)
    this.getData()
  }

  createChart(index: number, sensor: any) {
    const canvasElementId = 'chart-' + index
    const ctx = document.getElementById(canvasElementId) as HTMLCanvasElement
    const labels = sensor?.logs.map((item: any) => item.timestamp)
    const values = sensor?.logs.map((item: any) => item.value)
    console.log(ctx)
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: sensor.name,
            data: values,
            borderColor: 'rgba(46, 55, 255, 1)',
            backgroundColor: 'rgba(46, 55, 255, 0.2)',
            fill: false
          }]
        },
      });
    }
  }


  async getData() {
    try {
      this.loading = true
      const dataRef = dbRef(this.database, this.mainPath)
      await onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          this.data = snapshot.val()
          this.loading = false
          if(this.data.conditions != null && this.data.conditions != undefined) {
            this.data.conditions = Object.entries(this.data.conditions).map(([key, value]: any) => ({key, ...value}))
          }
          if(this.data.actuators != null && this.data.actuators != undefined) {
            this.data.actuators = Object.entries(this.data.actuators).map(([key, value]: any) => ({key, ...value}))
            this.data.actuators.forEach((actuator: any, index: any) => {
              this.data.actuators[index].pins = Object.entries(this.data.actuators[index].pins).map(([key, value]: any) => { return {key, value}})
            })
          }
          if(this.data.sensors != null && this.data.sensors != undefined) {
            this.data.sensors = Object.entries(this.data.sensors).map(([key, value]: any) => ({key, ...value}))
            this.data.sensors.forEach((sensor: any, index: any) => {
              this.data.sensors[index].pins = Object.entries(this.data.sensors[index].pins).map(([key, value]: any) => { return {key, value}})
              this.loading = false
              console.log(sensor)
              setTimeout(() => {
                if (sensor.logs) this.createChart(sensor.key, sensor);
              }, 0);
            })
          }
          const wifi = this.data.communications?.wifi
          this.wifi_active = wifi?.active
          this.wifi_ssid = wifi?.ssid
          this.wifi_password = wifi?.password
          this.wifi_ip = wifi?.ip
          this.wifi_ip_pc = wifi?.ip_pc
          const lora = this.data.communications?.lora
          this.lora_active = lora?.active
          this.lora_frequency = lora?.frequency
          this.lora_address = lora?.address
          const usb = this.data.communications?.usb
          this.usb_active = usb?.active
          this.usb_port = usb?.com
          const lan = this.data.communications?.lan
          this.lan_active = lan?.active
          this.lan_ip = lan?.ip
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  setSensorData(key: any) {
    this.selectedData = key
    if(this.selectedData != null) {
      const checkSensor = this.data.sensors.find((item: any) => item.key == key)
      if(checkSensor != null && checkSensor != undefined && checkSensor != '[]' && checkSensor != '') {
        const pins_reduce = checkSensor.pins.reduce((obj: any, item: any) => {
          obj[item.key] = item.value
          return obj
        }, {})
        this.sensor.name = checkSensor.name
        this.sensor.location = checkSensor.location
        this.sensor.unit = checkSensor.unit
        this.sensor.interface = checkSensor.interface
        this.actuator.threshold.min = checkSensor.threshold.min
        this.actuator.threshold.mid = checkSensor.threshold.mid
        this.actuator.threshold.max = checkSensor.threshold.max
        if(this.sensor.interface == 'SPI') this.spi = pins_reduce
        if(this.sensor.interface == 'I2C') this.i2c = pins_reduce
        if(this.sensor.interface == 'UART') this.uart = pins_reduce
        if(this.sensor.interface == 'MODBUS') this.modbus = pins_reduce
        if(this.sensor.interface == 'CANBUS') this.canbus = pins_reduce
        if(this.sensor.interface == 'USB-SPI') this.usbspi = pins_reduce
        if(this.sensor.interface == 'ETHERNET RJ-45') this.rj45 = pins_reduce
        if(this.sensor.interface == 'RS-232') this.rs232 = pins_reduce
      }
    } else {
      this.sensor.name = ''
      this.sensor.location = ''
      this.sensor.unit = '%'
      this.sensor.interface = 'SPI'
      this.actuator.threshold.min = 0
      this.actuator.threshold.mid = 0
      this.actuator.threshold.max = 0
    }
  }

  addNewCondition() {
    this.conditions.push({
      id: '',
      name: '',
      value: 0
    })
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1)
  }
  removeAction(index: number) {
    this.actions.splice(index, 1)
  }

  addNewAction() {
    this.actions.push({
      id: '',
      name: '',
      value: 0
    })
  }

  setActuator(key: any) {
    this.selectedActuator = key
    if(this.selectedActuator == null) {
      this.actuator.name = ''
      this.actuator.location = ''
      this.actuator.threshold.min = 0
      this.actuator.threshold.max = 0
      this.actuator.module = 'INVERTER 1to3'
    } else {
      const checkActuator = this.data.actuators.find((item: any) => item.key == key)
      if(checkActuator != null && checkActuator != undefined && checkActuator != '[]' && checkActuator != '') {
        const pins_reduce = checkActuator.pins.reduce((obj: any, item: any) => {
          obj[item.key] = item.value
          return obj
        }, {})
        this.actuator.name = checkActuator.name
        this.actuator.location = checkActuator.location
        this.actuator.module = checkActuator.interface
        this.actuator.threshold.min = checkActuator.threshold.min
        this.actuator.threshold.max = checkActuator.threshold.max
        if(this.actuator.module == 'INVERTER 1to3') this.inverter = pins_reduce
        if(this.actuator.module == 'ESC') this.esc = pins_reduce
        if(this.actuator.module == 'BTS' || this.actuator.module == 'BTN') this.bts = pins_reduce
        if(this.actuator.module == 'LM') this.lm = pins_reduce
      }
    }
  }

  setCondition(key: any) {
    this.selectedCondition = key
    if(this.selectedCondition == null) {
      this.condition_name = ''
      this.conditions = [
        {
          id: '',
          name: '',
          value: 0
        }
      ]
      this.actions = [
        {
          id: '',
          name: '',
          value: 0
        }
      ]
    } else {
      const checkCondition = this.data.conditions.find((item: any) => item.key == key)
      if(checkCondition != null && checkCondition != undefined) {
        let convertedConditions = checkCondition.conditions.map((condition: any) => {
          return {
            id: `${condition.id}-${condition.name}`,
            value: condition.value
          };
        });
        let convertedActions = checkCondition.actions.map((actions: any) => {
          return {
            id: `${actions.id}-${actions.name}`,
            value: actions.value
          };
        });
        this.conditions = convertedConditions
        this.actions = convertedActions
        this.condition_name = checkCondition.name
      }
    }
  }

  onSubmitSensor(event: Event) {
    event.preventDefault()
    let interface_mode: any = this.spi
    if(this.sensor.interface == 'I2C') interface_mode = this.i2c
    if(this.sensor.interface == 'UART') interface_mode = this.uart
    if(this.sensor.interface == 'MODBUS') interface_mode = this.modbus
    if(this.sensor.interface == 'CANBUS') interface_mode = this.canbus
    if(this.sensor.interface == 'USB-SPI') interface_mode = this.usbspi
    if(this.sensor.interface == 'ETHERNET RJ-45') interface_mode = this.rj45
    if(this.sensor.interface == 'RS-232') interface_mode = this.rs232

    let now: Date = new Date()
      var datetime = now.getDate() + '/' + (now.getMonth()+1) + '/' +now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes()

    let data = {
      name: this.sensor.name,
      unit: this.sensor.unit,
      location: this.sensor.location,
      created_at: datetime,
      threshold: this.sensor.threshold,
      value: this.sensor.value,
      interface: this.sensor.interface,
      pins: interface_mode,
    }
    let keyData =  0
    if(this.data.sensors != null) keyData = this.data.sensors.length
    if(this.selectedData != null) keyData = this.selectedData
    const dataRef = dbRef(this.database, this.mainPath+'/sensors/'+keyData)
    set(dataRef, data)
    document.getElementById('sensor_form_modal')?.click()
    window.location.reload()
  }

  onSubmitActuator(event: Event) {
    event.preventDefault()
    let module_mode: any = this.inverter
    if(this.actuator.module == 'I2C') module_mode = this.inverter
    if(this.actuator.module == 'ESC') module_mode = this.esc
    if(this.actuator.module == 'BTN' || this.actuator.module == 'BTS') module_mode = this.bts
    if(this.actuator.module == 'LM') module_mode = this.lm
    let now: Date = new Date()
    var datetime = now.getDate() + '/' + (now.getMonth()+1) + '/' +now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes()
    let data = {
      name: this.actuator.name,
      location: this.actuator.location,
      created_at: datetime,
      threshold: this.actuator.threshold,
      value: this.actuator.value,
      interface: this.actuator.module,
      pins: module_mode,
    }
    let keyData =  0
    if(this.data.actuators != null) keyData = this.data.actuators.length
    if(this.selectedActuator != null) keyData = this.selectedActuator
    const dataRef = dbRef(this.database, this.mainPath+'/actuators/'+keyData)
    set(dataRef, data)
    document.getElementById('actuator_form_modal')?.click()
    window.location.reload()
  }

  onSubmitCondition(event: Event) {
    event.preventDefault()
    let now: Date = new Date()
    var datetime = now.getDate() + '/' + (now.getMonth()+1) + '/' +now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes()
    let convertedConditions = this.conditions.map((condition: any) => {
      let identify = condition.id.split('-');
      console.log(identify)
      return {
        id: parseInt(identify[0]),
        name: identify[1],
        value: condition.value
      }
    })
    let convertedActions = this.actions.map((action: any) => {
      let identify = action.id.split('-');
      return {
        id: parseInt(identify[0]),
        name: identify[1],
        value: action.value
      }
    })
    let data = {
      name: this.condition_name,
      conditions: convertedConditions,
      actions: convertedActions
    }
    let keyData = 0
    if(this.data.conditions != null) keyData = this.data.conditions.length
    if(this.selectedCondition != null) keyData = this.selectedCondition
    const dataRef = dbRef(this.database, this.mainPath+'/conditions/'+keyData)
    document.getElementById('condition_form_modal')?.click()
    set(dataRef, data).then(() => window.location.reload())
  }

  deleteSensor() {
    const dataRef = dbRef(this.database, this.mainPath+'/sensors/'+this.selectedData)
    remove(dataRef).then(() => {
      window.location.reload()
    })
  }

  deleteActuator() {
    const dataRef = dbRef(this.database, this.mainPath+'/actuators/'+this.selectedActuator)
    remove(dataRef).then(() => {
      window.location.reload()
    })
  }

  deleteCondition() {
    const dataRef = dbRef(this.database, this.mainPath+'/conditions/'+this.selectedCondition)
    remove(dataRef).then(() => {
      window.location.reload()
    })
  }


  generateLogs(key: any) {
    const logs = [];
    let startDate = new Date()
    let endDate = new Date()
    endDate.setMonth(startDate.getMonth() + 1)
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      const temperature = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}`;

      logs.push({
          timestamp: formattedTimestamp,
          value: temperature
      });

      currentDate.setMinutes(currentDate.getMinutes() + 240);
  }
    const dataRef = dbRef(this.database, this.mainPath+'/sensors/'+key+'/logs')
    set(dataRef, logs).then(() => {
      window.location.reload()
    })
   }

  toggleRun(event: Event, index: number) {
    event.preventDefault()
    const pwmRef = dbRef(this.database, this.mainPath+'/actuators/'+index+'/value')
    set(pwmRef, this.data.actuators[index].value)
    const isActiceRef = dbRef(this.database, this.mainPath+'/actuators/'+index+'/is_active')
    set(isActiceRef, !this.data.actuators[index].is_active).then(() => window.location.reload())
  }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }
}
