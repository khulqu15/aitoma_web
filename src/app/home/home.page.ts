import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage'
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage implements AfterViewInit {
  @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;

  currentTheme: string = 'dark';
  selectedLanguage: number = 1;
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

  solutions: any = [
    {
      title: {0: 'Sederhanakan Operasi dengan Otomatisasi Tingkat Lanjut', 1: 'Streamline Operations with Advanced Automation', 2: '高度な自動化による運用の合理化'},
      subtitle: {0: 'Tingkatkan produktivitas dan efisiensi dengan kontrol motor cerdas dan pemantauan sensor', 1: 'Enhance productivity and efficiency with intelligent motor control and sensor monitoring', 2: 'インテリジェントなモーター制御とセンサー監視により、生産性と効率が向上します'},
      link: '#',
    },
    {
      title: {0: 'Buka Kekuatan Analisis Prediktif', 1: 'Unlock the Power of Predictive Analytics', 2: '予測分析の力を解き放つ'},
      subtitle: {0: 'Manfaatkan wawasan berbasis AI dengan LSTM, GRU, dan RCNN untuk memperkirakan hasil dan mengoptimalkan kinerja', 1: 'Leverage AI-driven insights with LSTM, GRU, and RCNN to forecast outcomes and optimize performance.', 2: 'LSTM、GRU、RCNN を使用して AI 主導の洞察を活用して、結果を予測し、パフォーマンスを最適化します'},
      link: '#',
    },
    {
      title: {0: 'Sederhanakan Operasi dengan Otomatisasi Tingkat Lanjut', 1: 'One Platform, Endless Possibilities', 2: '高度な自動化による運用の合理化'},
      subtitle: {0: 'Mudah beradaptasi dan serbaguna, AITOMA memenuhi kebutuhan industri apa pun dengan integrasi dan komunikasi yang lancar', 1: 'Adaptable and versatile, AITOMA meets the needs of any industry with seamless integration and communication', 2: '適応性と汎用性に優れた AITOMA は、シームレスな統合とコミュニケーションによりあらゆる業界のニーズを満たします'},
      link: '#',
    }
  ]

  services: any = [
    {
      title: {0: "Pemantauan Sensor Pintar", 1: "Smart Sensor Monitoring", 2: "スマートセンサーモニタリング"},
      subtitle: {0: "Data Real-time untuk Pengendalian Presisi", 1: "Real-time Data for Precision Control", 2: "精密制御のためのリアルタイムデータ"}
    },
    {
      title: {0: "Kontrol Motor Canggih", 1: "Advanced Motor Control", 2: "高度なモーター制御"},
      subtitle: {0: "Presisi di Setiap Gerakan", 1: "Precision in Every Movement", 2: "すべての動作における精度"}
    },
    {
      title: {0: "Perawatan Prediktif", 1: "Predictive Maintenance", 2: "予知保全"},
      subtitle: {0: "Perawatan Proaktif dengan Wawasan AI", 1: "Proactive Care with AI Insights", 2: "AIインサイトによるプロアクティブケア"}
    },
    {
      title: {0: "Konektivitas Tanpa Hambatan", 1: "Seamless Connectivity", 2: "シームレスな接続"},
      subtitle: {0: "Komunikasi Terpadu di Semua Platform",1: "Unified Communication Across Platforms",2: "すべてのプラットフォームにわたる統合コミュニケーション"}
    },
    {
      title: {0: "Model AI Adaptif",1: "Adaptive AI Models",2: "適応型AIモデル"},
      subtitle: {0: "Prediksi yang Disesuaikan untuk Kebutuhan Anda",1: "Tailored Predictions for Your Needs",2: "ニーズに合わせたカスタマイズ予測"}
    },
    {
      title: {0: "Integrasi Serbaguna",1: "Versatile Integration",2: "多目的統合"},
      subtitle: {0: "Satu Solusi, Kemungkinan Tak Terbatas",1: "One Solution, Infinite Possibilities",2: "1つのソリューションで無限の可能性" }
    },
    {
      title: {0: "Pemantauan & Pengendalian Jarak Jauh",1: "Remote Monitoring & Control",2: "リモートモニタリング＆コントロール"},
      subtitle: {0: "Kendalikan dan Pantau dari Mana Saja",1: "Command and Control from Anywhere",2: "どこからでも指揮と管理" }
    },
    {
      title: {0: "Siap untuk Masyarakat 5.0",1: "Ready for Society 5.0",2: "Society 5.0 への準備完了"},
      subtitle: {0: "Mempersiapkan Operasi untuk Masa Depan",1: "Future-Proof Your Operations",2: "将来に備えたオペレーション" }
    }
  ]

  currency: any = {0: 'Rp', 1: '$', 2: '¥'}

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
  ];

  footer: any = {
    0: "Hak Cipta © 2024 Hayago Indonesia. Hak cipta dilindungi undang-undang.",
    1: "Copyright © 2024 Hayago Indonesia. All rights reserved.",
    2: "著作権 © 2024 Hayago Indonesia. 無断転載を禁じます。"
  }

  faq: any = [
    {
      question: {
        0: "Apa itu AITOMA?",
        1: "What is AITOMA?",
        2: "AITOMAとは何ですか？"
      },
      answer: {
        0: "AITOMA adalah microcontroller cerdas yang dapat memantau sensor, mengontrol motor, dan memprediksi hasil dengan AI untuk berbagai kebutuhan industri.",
        1: "AITOMA is an intelligent microcontroller that can monitor sensors, control motors, and predict outcomes using AI for various industrial needs.",
        2: "AITOMAは、センサーを監視し、モーターを制御し、AIを使用してさまざまな産業ニーズに対応する結果を予測できるインテリジェントなマイクロコントローラーです。"
      }
    },
    {
      question: {
        0: "Bagaimana cara AITOMA berkomunikasi dengan perangkat lain?",
        1: "How does AITOMA communicate with other devices?",
        2: "AITOMAは他のデバイスとどのように通信しますか？"
      },
      answer: {
        0: "AITOMA dapat berkomunikasi melalui internet, LAN, dan LoRa untuk memastikan data yang mulus dan real-time.",
        1: "AITOMA can communicate via internet, LAN, and LoRa to ensure seamless and real-time data exchange.",
        2: "AITOMAは、インターネット、LAN、およびLoRaを介して通信し、シームレスでリアルタイムのデータ交換を実現します。"
      }
    },
    {
      question: {
        0: "Apa perbedaan antara paket Basic, Pro, dan Enterprise?",
        1: "What is the difference between Basic, Pro, and Enterprise packages?",
        2: "Basic、Pro、Enterpriseパッケージの違いは何ですか？"
      },
      answer: {
        0: "Paket Basic menawarkan fitur dasar, Pro menawarkan fitur lanjutan, dan Enterprise mencakup semua fitur dengan dukungan penuh.",
        1: "The Basic package offers essential features, Pro offers advanced features, and Enterprise includes all features with full support.",
        2: "Basicパッケージは基本機能を提供し、Proは高度な機能を提供し、Enterpriseにはすべての機能と完全なサポートが含まれています。"
      }
    },
    {
      question: {
        0: "Apakah AITOMA kompatibel dengan sistem yang sudah ada?",
        1: "Is AITOMA compatible with existing systems?",
        2: "AITOMAは既存のシステムと互換性がありますか？"
      },
      answer: {
        0: "Ya, AITOMA dirancang untuk integrasi yang mudah dengan sistem industri yang sudah ada.",
        1: "Yes, AITOMA is designed for easy integration with existing industrial systems.",
        2: "はい、AITOMAは既存の産業システムとの簡単な統合を目的としています。"
      }
    },
    {
      question: {
        0: "Metode AI apa yang digunakan oleh AITOMA?",
        1: "What AI methods does AITOMA use?",
        2: "AITOMAはどのようなAI手法を使用していますか？"
      },
      answer: {
        0: "AITOMA menggunakan LSTM, GRU, dan RCNN untuk prediksi dan analisis data yang canggih.",
        1: "AITOMA uses LSTM, GRU, and RCNN for advanced prediction and data analysis.",
        2: "AITOMAは、LSTM、GRU、およびRCNNを使用して、高度な予測とデータ分析を行います。"
      }
    },
    {
      question: {
        0: "Apakah AITOMA mendukung pemantauan jarak jauh?",
        1: "Does AITOMA support remote monitoring?",
        2: "AITOMAはリモート監視をサポートしていますか？"
      },
      answer: {
        0: "Ya, AITOMA memungkinkan pemantauan dan pengendalian jarak jauh melalui konektivitas internet.",
        1: "Yes, AITOMA enables remote monitoring and control through internet connectivity.",
        2: "はい、AITOMAはインターネット接続を介してリモート監視と制御を可能にします。"
      }
    },
    {
      question: {
        0: "Bagaimana cara memulai dengan AITOMA?",
        1: "How do I get started with AITOMA?",
        2: "AITOMAの使用を開始するにはどうすればよいですか？"
      },
      answer: {
        0: "Anda dapat memulai dengan memilih paket yang sesuai dan menghubungi kami untuk konsultasi dan dukungan teknis.",
        1: "You can get started by selecting the appropriate package and contacting us for consultation and technical support.",
        2: "適切なパッケージを選択し、相談や技術サポートについては当社にお問い合わせください。"
      }
    },
    {
      question: {
        0: "Apakah AITOMA mendukung pembaruan firmware?",
        1: "Does AITOMA support firmware updates?",
        2: "AITOMAはファームウェアのアップデートをサポートしていますか？"
      },
      answer: {
        0: "Ya, AITOMA mendukung pembaruan firmware secara berkala untuk meningkatkan fungsionalitas.",
        1: "Yes, AITOMA supports periodic firmware updates to enhance functionality.",
        2: "はい、AITOMAは機能強化のために定期的なファームウェアのアップデートをサポートしています。"
      }
    },
    {
      question: {
        0: "Bagaimana cara AITOMA memastikan keamanan data?",
        1: "How does AITOMA ensure data security?",
        2: "AITOMAはデータのセキュリティをどのように確保していますか？"
      },
      answer: {
        0: "AITOMA menggunakan enkripsi tingkat lanjut dan protokol keamanan untuk melindungi data Anda.",
        1: "AITOMA uses advanced encryption and security protocols to protect your data.",
        2: "AITOMAは、データを保護するために高度な暗号化とセキュリティプロトコルを使用しています。"
      }
    },
    {
      question: {
        0: "Apakah AITOMA mendukung solusi kustom?",
        1: "Does AITOMA support custom solutions?",
        2: "AITOMAはカスタムソリューションをサポートしていますか？"
      },
      answer: {
        0: "Ya, kami menawarkan solusi kustom yang disesuaikan dengan kebutuhan spesifik industri Anda.",
        1: "Yes, we offer custom solutions tailored to your specific industry needs.",
        2: "はい、私たちはお客様の特定の業界ニーズに合わせたカスタムソリューションを提供しています。"
      }
    }
  ];


  contact: any = {
    title: { 0: "Hubungi Kami", 1: "Contact Us", 2: "お問い合わせ" },
    subtitle: { 0: "Kami siap membantu Anda untuk segala kebutuhan industri Anda.", 1: "We are here to assist you with all your industrial needs.", 2: "私たちは、すべての産業ニーズに対応するためにここにいます。"},
    address: { 0: "Alamat", 1: "Address", 2: "住所"},
    addressDetails: { 0: "Jl. Kalisari Damen No. 57, Surabaya, Indonesia", 1: "57 Kalisari Damen St., Surabaya, Indonesia", 2: "インダストリー通り57号, スラバヤ, インドネシア"},
    phone: { 0: "Telepon", 1: "Phone", 2: "電話番号"},
    phoneDetails: { 0: "+62 89 539 600 4952", 1: "+62 89 539 600 4952", 2: "+62 89 539 600 4952"},
    email: { 0: "Email", 1: "Email", 2: "メール"},
    emailDetails: { 0: "ninno@hayago.id", 1: "ninno@hayago.id", 2: "ninno@hayago.id"},
    formTitle: { 0: "Kirim Pesan", 1: "Send a Message", 2: "メッセージを送る"},
    formSubtitle: { 0: "Isi formulir di bawah ini dan kami akan menghubungi Anda secepatnya.", 1: "Fill out the form below, and we'll get back to you as soon as possible.", 2: "以下のフォームに記入していただくと、できるだけ早くご連絡いたします。"},
    buttonText: { 0: "Kirim", 1: "Send", 2: "送信" }
  };


  constructor(private renderer: Renderer2, private router: Router) {}

  ngAfterViewInit(): void {
    const video = this.backgroundVideo.nativeElement;
    video.muted = true;
    video.play().catch(error => {
      console.error('Video playback failed:', error);
    })
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: number = parseInt(localStorage.getItem('language')!) || 1
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
  }

  navigatePush(path: string): void {
    this.router.navigate([path])
  }

  onPayment(category: number): void {
    const selectedPrice = this.pricing[category]
    console.log(selectedPrice)
  }

}
