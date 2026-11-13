import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  closeCircle,
  imageOutline,
  locationOutline,
  calendarOutline
} from 'ionicons/icons';

interface FoundItem {
  id: number;
  itemName: string;
  category: string;
  description: string;
  dateFound: string;
  photo: string;
  status: string;
  location: string;
}

@Component({
  selector: 'app-found-items',
  templateUrl: './found-items.page.html',
  styleUrls: ['./found-items.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ],
})
export class FoundItemsPage {

  foundItems: FoundItem[] = [];
  filteredItems: FoundItem[] = [];

  searchText = '';
  selectedCategory = 'All Items';
  itemCount = 0;

  categories = [
    'All Items',
    'Electronics',
    'Personal',
    'Accessories',
    'School Supplies',
    'Others'
  ];

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({
      searchOutline,
      closeCircle,
      imageOutline,
      locationOutline,
      calendarOutline
    });
  }

  async ionViewWillEnter() {
    await this.loadFoundItems();
  }

  async loadFoundItems() {
    try {
      const result = await Preferences.get({
        key: 'findit_reports'
      });

      const savedReports = result.value
        ? JSON.parse(result.value)
        : [];

      // Keep only reports with FOUND status
      this.foundItems = Array.isArray(savedReports)
        ? savedReports.filter(
            (item: FoundItem) => item.status === 'FOUND'
          )
        : [];

      this.applyFilters();

      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error loading found items:', error);

      this.foundItems = [];
      this.filteredItems = [];
      this.itemCount = 0;

      this.cdr.detectChanges();
    }
  }

  applyFilters() {
    const search = this.searchText.trim().toLowerCase();

    this.filteredItems = this.foundItems.filter((item) => {

      const name = (item.itemName ?? '').toLowerCase();
      const category = (item.category ?? '').toLowerCase();
      const description = (item.description ?? '').toLowerCase();
      const location = (item.location ?? '').toLowerCase();

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

    this.itemCount = this.filteredItems.length;

    this.cdr.detectChanges();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

}