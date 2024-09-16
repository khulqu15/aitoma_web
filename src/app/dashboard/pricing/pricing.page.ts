import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LoginComponent } from 'src/app/components/dashboard/login/login.component';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LoginComponent]
})
export class PricingPage implements AfterViewInit {
  selectedLanguage: number = 1
  currentTheme: string = 'dark'
  localIndustry: any = null
  isStart: boolean = false
  selectedStart: number = 0
  pricing: any = [
    {
      categoryName: { 0: 'Dasar', 1: 'Basic', 2: '基本' },
      price: { 0: '1.000.000', 1: '100', 2: '10,000' },
      description: {0: 'Paket ideal untuk usaha kecil yang membutuhkan otomatisasi dasar.', 1: 'Ideal package for small businesses needing basic automation.', 2: '基本的な自動化を必要とする小規模企業に最適なパッケージ。'},
      features: [
        { 0: 'Pemantauan sensor dasar', 1: 'Basic sensor monitoring', 2: '基本センサーモニタリング' },
        { 0: 'Kontrol motor terbatas', 1: 'Limited motor control', 2: '限定モーター制御' },
        { 0: 'Konektivitas LAN', 1: 'LAN connectivity', 2: 'LAN接続' }
      ]
    },
    {
      categoryName: { 0: 'Pro', 1: 'Pro', 2: 'プロ' },
      price: { 0: '3.000.000', 1: '300', 2: '30,000' },
      description: {0: 'Paket lanjutan untuk perusahaan yang membutuhkan kontrol lebih canggih.', 1: 'Advanced package for companies requiring more sophisticated control.', 2: 'より高度な制御を必要とする企業向けの高度なパッケージ。'},
      features: [
        { 0: 'Semua fitur Basic', 1: 'All Basic features', 2: 'すべての基本機能' },
        { 0: 'Kontrol motor lanjutan', 1: 'Advanced motor control', 2: '高度なモーター制御' },
        { 0: 'Prediksi AI menggunakan LSTM', 1: 'AI prediction with LSTM', 2: 'LSTMを使用したAI予測' },
        { 0: 'Konektivitas LoRa', 1: 'LoRa connectivity', 2: 'LoRa接続' }
      ]
    },
    {
      categoryName: { 0: 'Enterprise', 1: 'Enterprise', 2: 'エンタープライズ' },
      price: { 0: '6.000.000', 1: '600', 2: '60,000' },
      description: {0: 'Paket lengkap untuk perusahaan besar yang memerlukan solusi industri canggih.', 1: 'Comprehensive package for large enterprises needing advanced industrial solutions.', 2: '高度な産業ソリューションを必要とする大企業向けの包括的なパッケージ。'},
      features: [
        { 0: 'Semua fitur Pro', 1: 'All Pro features', 2: 'すべてのプロ機能' },
        { 0: 'Prediksi AI menggunakan GRU dan RCNN', 1: 'AI prediction with GRU and RCNN', 2: 'GRUとRCNNを使用したAI予測' },
        { 0: 'Konektivitas internet penuh', 1: 'Full internet connectivity', 2: '完全なインターネット接続' },
        { 0: 'Pemantauan dan pengendalian jarak jauh', 1: 'Remote monitoring and control', 2: 'リモートモニタリングとコントロール' },
        { 0: 'Dukungan pelanggan 24/7', 1: '24/7 customer support', 2: '24時間365日のカスタマーサポート' }
      ]
    }
  ]

  currency: any = {0: 'Rp', 1: '$', 2: '¥'}

  constructor(private renderer: Renderer2, private router: Router, private api: ApiService) { }

  ngAfterViewInit(): void {
    let sessionUser: any = sessionStorage.getItem('user')
    if(sessionUser == null || sessionUser == undefined || sessionUser == '') this.router.navigate(['/login']).then(() => window.location.reload())
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: any = localStorage.getItem('language') || 1
    let localIndustries: any = localStorage.getItem('industries')
    localLanguage = parseInt(localLanguage)
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    if(localIndustries != null && localIndustries != undefined && localIndustries != '') this.localIndustry = JSON.parse(localIndustries)
  }

  navigatePush(path: string, fragment?: string): void {
    this.router.navigate([path], {fragment: fragment})
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  onPay(index: number) {
    this.selectedStart = index
    let amount: any = this.pricing[this.selectedStart].price[0]
    const normalizedPriceString = amount.replace(/\./g, '')
    const priceNumber = parseInt(normalizedPriceString, 10);
    const endpoint = environment.backend + '/midtrans/create'
    this.api.postData(endpoint, {
      "user_id": 1,
      "amount": priceNumber,
      "item_id": this.makeid(6),
      "item_name": this.makeid(42)
    }).then((response) => {
      console.log(response)
      window.open(response.data.redirect_url)
    })
  }

  logout() {
    sessionStorage.removeItem('user')
    this.router.navigate(['/login']).then(() => window.location.reload())
  }
}
