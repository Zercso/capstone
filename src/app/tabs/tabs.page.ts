
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  searchOutline,
  cubeOutline,
  addCircleOutline,
  informationCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ],
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      searchOutline,
      cubeOutline,
      addCircleOutline,
      informationCircleOutline
    });
  }
}
