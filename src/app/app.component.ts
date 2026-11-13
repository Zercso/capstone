
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor() {
    this.configureStatusBar();
  }

  async configureStatusBar() {
    try {
      await StatusBar.setOverlaysWebView({
        overlay: false
      });

      await StatusBar.setBackgroundColor({
        color: '#F7F8FA'
      });

      await StatusBar.setStyle({
        style: Style.Dark
      });

    } catch (error) {
      console.error('Status bar configuration error:', error);
    }
  }
}
