import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
})
export class MenuComponent  implements OnInit {
  selectedLanguage: number = 1
  currentTheme: string = 'dark'
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


}
