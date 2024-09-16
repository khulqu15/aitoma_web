import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then(m => m.AboutPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./dashboard/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./dashboard/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'devices',
    loadComponent: () => import('./dashboard/devices/devices.page').then( m => m.DevicesPage)
  },
  {
    path: 'actuators',
    loadComponent: () => import('./dashboard/actuators/actuators.page').then( m => m.ActuatorsPage)
  },
  {
    path: 'sensors',
    loadComponent: () => import('./dashboard/sensors/sensors.page').then( m => m.SensorsPage)
  },
  {
    path: 'conditions',
    loadComponent: () => import('./dashboard/conditions/conditions.page').then( m => m.ConditionsPage)
  },
  {
    path: 'datasheets',
    loadComponent: () => import('./dashboard/datasheets/datasheets.page').then( m => m.DatasheetsPage)
  },
  {
    path: 'incidents',
    loadComponent: () => import('./dashboard/incidents/incidents.page').then( m => m.IncidentsPage)
  },
  {
    path: 'device/:uid',
    loadComponent: () => import('./dashboard/device/device.page').then( m => m.DevicePage)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./dashboard/pricing/pricing.page').then( m => m.PricingPage)
  },
];
