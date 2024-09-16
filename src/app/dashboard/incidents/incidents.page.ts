import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/dashboard/navbar/navbar.component';
import { MenuComponent } from 'src/app/components/dashboard/menu/menu.component';
import { Database, ref as dbRef, onValue, remove, set } from '@angular/fire/database';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, MenuComponent]
})
export class IncidentsPage implements OnInit {
  database: Database = inject(Database)
  constructor() { }
  data: any = []
  mainPath: string = 'hayago/incidents'
  selectedData: any = null
  title: string = ''
  subtitle: string = ''
  location: string = ''
  date: string = ''
  time: string = ''
  link: string = ''

  ngOnInit() {
    this.getData()
  }

  async getData() {
    try {
      const dataRef = await dbRef(this.database, this.mainPath)
      onValue(dataRef, (snapshot) => {
        if(snapshot.exists()) {
          this.data = snapshot.val()
          this.data.forEach((item: any, index: number) => {
            const timestamp = this.data[index].timestamp
            const date = new Date(timestamp)
            const day = date.getUTCDate()
            const month = date.getUTCMonth()
            const year = date.getUTCFullYear()
            const hours = date.getUTCHours()
            const minutes = date.getUTCMinutes()
            this.data[index].timestamp = `${day}-${month}-${year} ${hours}:${minutes}`
          })
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  setSelect(index: any) {
    this.selectedData = index
    if(index == null) {
      this.title = ''
      this.subtitle = ''
      this.location = ''
      this.date = ''
      this.time = ''
      this.link = ''
    } else {
      this.title = this.data[index].title
      this.subtitle = this.data[index].subtitle
      this.location = this.data[index].location
      this.link = this.data[index].link
      const timestamp = this.data[index].timestamp
      const date = new Date(timestamp)
      this.date = date.toISOString().substring(0, 10)
      this.time = date.toISOString().substring(11, 16)
    }
  }

  onSubmit() {
    let pathRef = 'hayago/incidents/'+this.data.length
    if (this.selectedData != null) {
      pathRef = 'hayago/incidents/'+this.selectedData
    }
    const dataRef = dbRef(this.database, pathRef)
    const dateString = `${this.date}T${this.time}:00Z`
    const timestamp = new Date(dateString).toISOString()
    set(dataRef, {
      title: this.title,
      subtitle: this.subtitle,
      location: this.location,
      timestamp: timestamp,
    }).then(() => {
      console.log('Success')
    })
    document.getElementById('form_modal')?.click()
  }

  onDelete() {
    const dataRef = dbRef(this.database, 'hayago/incidents/'+this.selectedData)
    remove(dataRef).then(() => {
      console.log('Data deleted successfully');
      document.getElementById('delete_modal')?.click();
      this.reorderData();
    }).catch((error) => {
      console.error('Error deleting data:', error);
    });
    document.getElementById('delete_modal')?.click()
    this.getData()
  }

  reorderData() {
    const dataRef = dbRef(this.database, 'hayago/incidents/');
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reorderedData: any[] = [];
        let index = 0;
        for (let key in data) {
          reorderedData.push({ ...data[key], id: index });
          index++;
        }
        this.updateData(reorderedData);
      }
    });
  }

  updateData(reorderedData: any[]) {
    const dataRef = dbRef(this.database, 'hayago/incidents/');
    remove(dataRef).then(() => {
      reorderedData.forEach((item, index) => {
        const newRef = dbRef(this.database, 'hayago/incidents/' + index);
        set(newRef, item);
      });
    }).catch((error) => {
      console.error('Error updating data:', error);
    });
  }
}
