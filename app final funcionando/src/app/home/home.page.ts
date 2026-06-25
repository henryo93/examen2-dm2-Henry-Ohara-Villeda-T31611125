import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonList, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { map, images, camera, image } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonIcon,
    IonList
  ],
})
export class HomePage {

  imagenSeleccionada: string | null = null;
  mensaje: string = '';

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private router: Router
  ) {
    addIcons({ map, images, camera, image });
  }

  async seleccionarImagen() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿De dónde deseas obtener la imagen?',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => this.obtenerImagen(CameraSource.Camera)
        },
        {
          text: 'Elegir de galería',
          icon: 'images',
          handler: () => this.obtenerImagen(CameraSource.Photos)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async obtenerImagen(source: CameraSource) {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });
      if (photo.dataUrl) {
        this.imagenSeleccionada = photo.dataUrl;
      }
    } catch (error) {
      // Usuario canceló la selección, no se muestra nada
      console.log('Selección cancelada');
    }
  }

  goToGallery() {
    // Ya estamos en galería
  }

  goToMap() {
    this.router.navigate(['/map']);
  }
}
