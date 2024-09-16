import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, NavbarComponent, FooterComponent],
})


export class AboutPage implements AfterViewInit {
  currentTheme: string = 'dark';
  selectedLanguage: number = 0;

  languagesVocab: any = [
    {0: 'Solusi', 1: 'Solution', 2: 'ソリューション'},
    {0: 'Layanan', 1: 'Service', 2: 'サービス'},
    {0: 'Harga', 1: 'Pricing', 2: '価格設定'},
    {0: 'FAQ', 1: 'FAQ', 2: 'よくある質問'},
    {0: 'Kontak', 1: 'Contact', 2: '連絡先'},
    {0: 'Memberdayakan Industri dengan Otomasi Cerdas untuk Masa Depan yang Lebih Cerdas.', 1: 'Empowering Industries with Intelligent Automation for a Smarter Future.', 2: 'インテリジェントオートメーションでスマートな未来を実現するための産業力強化。'},
    {0: 'Integrasi tanpa batas, solusi adaptif, dan teknologi prediktif untuk setiap industri.', 1: 'Seamless integration, adaptive solutions, and predictive technology for every industry.', 2: 'すべての産業に対応するシームレスな統合、適応型ソリューション、予測技術。'},
    {0: 'Detail Lebih Lanjut', 1: 'More Detail', 2: '詳細を見る'},
    {0: 'Tentang Kami', 1: 'About Us', 2: '私たちについて'},
    {0: 'Solusi Kami untuk Dunia yang Lebih Cerdas dan Terhubung', 1: 'Our Solutions for a Smarter, Connected World', 2: 'よりスマートでつながった世界のための当社のソリューション'},
    {0: 'Solusi Komprehensif Kami', 1: 'Our Comprehensive Solutions', 2: '当社の包括的なソリューション'},
    {0: "Paket Harga", 1: "Pricing Packages", 2: "料金プラン"},
    {0: "Pilih paket yang sesuai dengan kebutuhan industri Anda.", 1: "Choose the package that best suits your industry needs.", 2: "業界のニーズに最適なプランをお選びください。"},
    {0: "Pertanyaan yang Sering Diajukan", 1: "Frequently Asked Questions", 2: "よくある質問"},
    {0: "Temukan jawaban atas pertanyaan umum tentang produk dan layanan kami.", 1: "Find answers to common questions about our products and services.", 2: "製品およびサービスに関するよくある質問への回答をご覧ください。"}
  ]

  about: any = {
    title: {
      0: "Selamat Datang di Hayago Indonesia",
      1: "Welcome to Hayago Indonesia",
      2: "Hayago Indonesiaへようこそ"
    },
    subtitle: {
      0: "Membawa Solusi Industri Cerdas ke Dunia",
      1: "Bringing Smart Industrial Solutions to the World",
      2: "スマート産業ソリューションを世界へ"
    },
    description: {
      0: "Hayago Indonesia adalah perusahaan inovatif yang berfokus pada pengembangan solusi teknologi cerdas untuk kebutuhan industri. Dengan tim ahli di berbagai bidang, kami berkomitmen untuk memberikan solusi yang dapat meningkatkan efisiensi dan produktivitas melalui otomatisasi dan kecerdasan buatan.",
      1: "Hayago Indonesia is an innovative company focused on developing smart technology solutions for industrial needs. With a team of experts across various fields, we are committed to delivering solutions that enhance efficiency and productivity through automation and artificial intelligence.",
      2: "Hayago Indonesiaは、産業ニーズに対応するスマートテクノロジーソリューションの開発に注力する革新的な企業です。さまざまな分野の専門家チームとともに、オートメーションと人工知能を通じて効率と生産性を向上させるソリューションを提供することを約束します。"
    },
    productSection: {
      title: {
        0: "Produk Unggulan Kami: AITOMA",
        1: "Our Flagship Product: AITOMA",
        2: "当社のフラッグシップ製品：AITOMA"
      },
      description: {
        0: "AITOMA adalah solusi otomatisasi industri yang dirancang untuk memantau, mengontrol, dan memprediksi hasil dengan AI, cocok untuk berbagai kebutuhan industri.",
        1: "AITOMA is an industrial automation solution designed to monitor, control, and predict outcomes with AI, suitable for various industrial needs.",
        2: "AITOMAは、AIを使用して監視、制御、および結果を予測するように設計された産業オートメーションソリューションであり、さまざまな産業ニーズに適しています。"
      }
    },
    teamSection: {
      title: {
        0: "Tim Hayago",
        1: "The Hayago Team",
        2: "Hayagoチーム"
      },
      subtitle: {
        0: "Bertemu dengan para profesional di balik AITOMA",
        1: "Meet the professionals behind AITOMA",
        2: "AITOMAの背後にいるプロフェッショナルに会いましょう"
      },
      members: [
        {
          name: "Mohammad Khusnul Khuluq",
          role: {
            0: "CO - Founder, CTO",
            1: "CO - Founder, CTO",
            2: "共同創設者, CTO"
          }
        },
        {
          name: "Hariz Izzudin",
          role: {
            0: "CEO",
            1: "CEO",
            2: "CEO"
          }
        },
        {
          name: "Kasih Aisyah",
          role: {
            0: "CMO",
            1: "CMO",
            2: "CMO"
          }
        },
        {
          name: "Jimly Adam",
          role: {
            0: "Insinyur Elektronik",
            1: "Electronics Engineer",
            2: "電子エンジニア"
          }
        },
        {
          name: "Wahyu Dwi Ahmadi",
          role: {
            0: "Teknik Mekatronika",
            1: "Mechatronics Engineering",
            2: "メカトロニクス工学"
          }
        },
        {
          name: "Fajri Syawqi",
          role: {
            0: "Desainer CAD",
            1: "CAD Designer",
            2: "CADデザイナー"
          }
        },
        {
          name: "Fadli Robbi",
          role: {
            0: "Desainer 3D CGI",
            1: "3D CGI Designer",
            2: "3D CGIデザイナー"
          }
        }
      ]
    }
  };

  ngAfterViewInit(): void {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: number = parseInt(localStorage.getItem('language')!) || 1
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
  }

  constructor(private renderer: Renderer2) {}

  toggleTheme(): void {
    this.currentTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  changeLanguage(option: number): void {
    this.selectedLanguage = option
    localStorage.setItem('language', this.selectedLanguage.toString());
  }
}
