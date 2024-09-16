import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})
export class ConditionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
