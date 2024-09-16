import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Database, ref as dbRef, onValue, set} from '@angular/fire/database';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent  implements OnInit {
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  notifications: any = []

  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, @Inject(Database) private database: Database) { }

  ngOnInit() {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: any = localStorage.getItem('language') || 1
    localLanguage = parseInt(localLanguage)
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    this.getNotifications()
  }

  async getNotifications() {
    try {
      const notificationRef = dbRef(this.database, 'hayago/notifications')
      onValue(notificationRef, (snapshot) => {
        this.notifications = snapshot.val()
      })
    } catch(error) {
      console.log(error)
    }
  }

  readNotification(index: number, link: string) {
    const notificationRef = dbRef(this.database, 'hayago/notifications/'+index+'/is_read')
    set(notificationRef, true)
    window.open(link)
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

  logout() {
    sessionStorage.removeItem('user')
    this.router.navigate(['/login']).then(() => window.location.reload())
  }

}
