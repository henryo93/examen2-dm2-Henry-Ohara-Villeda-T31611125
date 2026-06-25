import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonSpinner, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigate, locationOutline, refresh } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  imports: [
    DecimalPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon, IonButton
  ]
})
export class MapPage implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  cargando = true;
  permisoDenegado = false;
  latitud: number | null = null;
  longitud: number | null = null;

  constructor(private ngZone: NgZone) {
    addIcons({ navigate, locationOutline, refresh });
  }

  async ngAfterViewInit() {
    await this.cargarMapa();
  }

  async cargarMapa() {
    this.ngZone.run(() => {
      this.cargando = true;
      this.permisoDenegado = false;
      this.latitud = null;
      this.longitud = null;
    });

    try {
      await this.loadGoogleMapsScript();

      // Solicitar permisos de ubicación
      let lat = 4.7110;
      let lng = -74.0721;

      try {
        const permisos = await Geolocation.requestPermissions();

        if (permisos.location === 'granted') {
          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } else {
          this.ngZone.run(() => {
            this.permisoDenegado = true;
            this.cargando = false;
          });
          return;
        }
      } catch {
        this.ngZone.run(() => {
          this.permisoDenegado = true;
          this.cargando = false;
        });
        return;
      }

      this.ngZone.run(() => {
        this.latitud = lat;
        this.longitud = lng;
        this.cargando = false;
      });

      // Esperar que Angular renderice el div antes de montar el mapa
      setTimeout(() => this.renderizarMapa(lat, lng), 150);

    } catch {
      this.ngZone.run(() => this.cargando = false);
    }
  }

  private renderizarMapa(lat: number, lng: number) {
    const centro = { lat, lng };

    const mapa = new google.maps.Map(this.mapContainer.nativeElement, {
      center: centro,
      zoom: 16,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });

    // Marcador con ícono personalizado del cilindro de gas
    new google.maps.Marker({
      position: centro,
      map: mapa,
      icon: {
        url: 'assets/icons/gas-cylinder.svg',
        scaledSize: new google.maps.Size(42, 70),
        anchor: new google.maps.Point(21, 70)
      },
      title: 'Tu ubicación actual'
    });
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.maps) {
        resolve();
        return;
      }
      // Evitar cargar el script más de una vez
      if (document.querySelector('script[data-gmaps]')) {
        const check = setInterval(() => {
          if ((window as any).google?.maps) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        return;
      }
      const script = document.createElement('script');
      script.setAttribute('data-gmaps', 'true');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQOEnpMZo51o4OC8IfGmYMT6jXOxlYqfs';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
      document.head.appendChild(script);
    });
  }

  reintentar() {
    this.cargarMapa();
  }
}
