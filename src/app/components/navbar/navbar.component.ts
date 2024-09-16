import { IonContent } from '@ionic/angular/standalone';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent  implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
  languagesVocab: any = [
    {0: 'Solusi', 1: 'Solution', 2: 'ソリューション'},
    {0: 'Layanan', 1: 'Service', 2: 'サービス'},
    {0: 'Harga', 1: 'Pricing', 2: '価格設定'},
    {0: 'FAQ', 1: 'FAQ', 2: 'よくある質問'},
    {0: 'Kontak', 1: 'Contact', 2: '連絡先'},
  ]
  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: any = localStorage.getItem('language') || 1
    localLanguage = parseInt(localLanguage)
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
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

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }
}
