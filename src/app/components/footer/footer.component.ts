import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,

})
export class FooterComponent  implements OnInit {
  selectedLanguage: number = 1
  currentTheme: string = 'dark'
  footer: any = {
    0: "Hak Cipta © 2024 Hayago Indonesia. Hak cipta dilindungi undang-undang.",
    1: "Copyright © 2024 Hayago Indonesia. All rights reserved.",
    2: "著作権 © 2024 Hayago Indonesia. 無断転載を禁じます。"
  }
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: any = localStorage.getItem('language') || 1
    localLanguage = parseInt(localLanguage)
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
  }
}
