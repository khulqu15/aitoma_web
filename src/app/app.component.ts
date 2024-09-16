import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HomePage } from './home/home.page';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const routes: Routes = [
  { path: 'home', component: HomePage }
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, LeafletModule],
})
export class AppComponent {
  constructor(private router: Router) {}

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }
}
