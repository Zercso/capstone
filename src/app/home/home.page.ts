import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  closeCircle,
  arrowForward,
  imageOutline,
  locationOutline,
  calendarOutline,
  informationCircle
} from 'ionicons/icons';

interface ReportItem {
  id: number;
  itemName: string;
  category: string;
  description: string;
  dateFound: string;
  dateLost: string;
  photo: string;
  status: string;
  location: string;
  lastSeenLocation: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ],
})
export class HomePage {

  reports: ReportItem[] = [];
  filteredReports: ReportItem[] = [];

  searchText = '';
  selectedCategory = 'All Items';

  categories = [
    'All Items',
    'Electronics',
    'Personal',
    'Accessories',
    'School Supplies',
    'Others'
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    addIcons({
      searchOutline,
      closeCircle,
      arrowForward,
      imageOutline,
      locationOutline,
      calendarOutline,
      informationCircle
    });
  }

  async ionViewWillEnter() {
    await this.loadReports();
  }

  async loadReports() {
    try {
      const result = await Preferences.get({
        key: 'findit_reports'
      });

      const savedReports = result.value
        ? JSON.parse(result.value)
        : [];

      this.reports = Array.isArray(savedReports)
        ? savedReports
        : [];

      // Newest reports first
      this.reports.sort((a, b) => b.id - a.id);

      this.applyFilters();

      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error loading home reports:', error);

      this.reports = [];
      this.filteredReports = [];

      this.cdr.detectChanges();
    }
  }

  applyFilters() {
    const search = this.searchText.trim().toLowerCase();

    this.filteredReports = this.reports.filter((item) => {

      const name = (item.itemName ?? '').toLowerCase();
      const category = (item.category ?? '').toLowerCase();
      const description = (item.description ?? '').toLowerCase();
      const location = (
        item.lastSeenLocation || item.location || ''
      ).toLowerCase();

      const matchesCategory =
        this.selectedCategory === 'All Items' ||
        item.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        name.includes(search) ||
        category.includes(search) ||
        description.includes(search) ||
        location.includes(search);

      return matchesCategory && matchesSearch;
    });

    this.cdr.detectChanges();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  get recentReports(): ReportItem[] {
    return this.filteredReports.slice(0, 4);
  }

  getReportDate(item: ReportItem): string {
    return item.status === 'LOST'
      ? item.dateLost
      : item.dateFound;
  }

  getReportLocation(item: ReportItem): string {
    return item.status === 'LOST'
      ? item.lastSeenLocation
      : item.location;
  }

  viewLostItems() {
    this.router.navigateByUrl('/tabs/lost-items');
  }

}