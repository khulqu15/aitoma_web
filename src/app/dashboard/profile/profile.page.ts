import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})
export class ProfilePage implements OnInit {
  user: any = null
  avatar: any = '../../../assets/image/avatar.png'
  isImageLoaded: boolean = true;
  scadaSettings: any = [
    { menu: 'User Interface', link: 'https://aitoma.hayago.id/scada-ui' },
    { menu: 'System Monitoring', link: 'https://aitoma.hayago.id/system-monitoring' },
    { menu: 'Data Logging', link: 'https://aitoma.hayago.id/data-logging' },
    { menu: 'Alarm Management', link: 'https://aitoma.hayago.id/alarm-management' },
    { menu: 'Historical Data', link: 'https://aitoma.hayago.id/historical-data' },
    { menu: 'Control Panel', link: 'https://aitoma.hayago.id/control-panel' },
    { menu: 'Reports', link: 'https://aitoma.hayago.id/reports' },
    { menu: 'Device Management', link: 'https://aitoma.hayago.id/device-management' },
    { menu: 'User Permissions', link: 'https://aitoma.hayago.id/user-permissions' }
  ];
  constructor() { }

  onImageLoad() {
    this.isImageLoaded = true;
    console.log('Image loaded successfully.');
  }

  onImageError() {
    this.isImageLoaded = false;
    console.log('Error loading image. Reverting to default avatar.');
    this.avatar = '../../../assets/image/avatar.png';
  }


  ngOnInit() {
    const session_user = sessionStorage.getItem('user')
    if(session_user != null && session_user != undefined && session_user != '') {
      this.user = JSON.parse(session_user)
      console.log(this.user)
      this.avatar = this.user.photoURL
    }
  }

}
