import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'lost-items',
        loadComponent: () => import('./pages/lost-items/lost-items.page').then((m) => m.LostItemsPage),
      },
      {
        path: 'found-items',
        loadComponent: () => import('./pages/found-items/found-items.page').then((m) => m.FoundItemsPage),
      },
      {
        path: 'report-item',
        loadComponent: () =>
          import('./pages/report-item/report-item.page').then(
            (m) => m.ReportItemPage
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
