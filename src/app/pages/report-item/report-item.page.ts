import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { Preferences } from '@capacitor/preferences';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  checkmarkCircle,
  searchOutline,
  chevronForward,
  cameraOutline,
  imagesOutline,
  trashOutline,
  pricetagOutline,
  calendarOutline,
  locationOutline,
  alertCircle,
  informationCircle
} from 'ionicons/icons';

type ReportType = 'FOUND' | 'LOST';
type FieldName =
  | 'itemName'
  | 'category'
  | 'description'
  | 'date'
  | 'location'
  | 'photo';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.page.html',
  styleUrls: ['./report-item.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ],
})
export class ReportItemPage {

  reportType: ReportType | null = null;

  photoDataUrl: string | null = null;
  isTakingPhoto = false;
  isSubmitting = false;

  submitted = false;
  showSuccess = false;
  submittedType: ReportType | null = null;

  itemName = '';
  category = '';
  description = '';

  dateFound = '';
  dateLost = '';
  lastSeenLocation = '';

  readonly maxDescription = 300;
  readonly today = this.formatDate(new Date());

  categories = [
    'Electronics',
    'Personal',
    'Accessories',
    'School Supplies',
    'Others'
  ];

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({
      checkmarkCircleOutline,
      checkmarkCircle,
      searchOutline,
      chevronForward,
      cameraOutline,
      imagesOutline,
      trashOutline,
      pricetagOutline,
      calendarOutline,
      locationOutline,
      alertCircle,
      informationCircle
    });
  }

  chooseReportType(type: ReportType) {
    this.reportType = type;
    this.submitted = false;
    this.showSuccess = false;
    this.ensureDefaultDates();
  }

  // Switch between Lost and Found without losing what was typed
  switchType(type: ReportType) {
    if (this.reportType === type) {
      return;
    }

    this.reportType = type;
    this.submitted = false;
    this.ensureDefaultDates();
    this.cdr.detectChanges();
  }

  reportAnother() {
    this.showSuccess = false;
    this.submittedType = null;
    this.reportType = null;
    this.cdr.detectChanges();
  }

  private ensureDefaultDates() {
    if (!this.dateFound) {
      this.dateFound = this.today;
    }

    if (!this.dateLost) {
      this.dateLost = this.today;
    }
  }

  resetForm() {
    this.itemName = '';
    this.category = '';
    this.description = '';
    this.dateFound = '';
    this.dateLost = '';
    this.lastSeenLocation = '';
    this.photoDataUrl = null;
    this.submitted = false;

    this.cdr.detectChanges();
  }

  async takePhoto(source: CameraSource = CameraSource.Camera) {

    if (this.isTakingPhoto) {
      return;
    }

    this.isTakingPhoto = true;

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source
      });

      if (photo.dataUrl) {
        this.photoDataUrl = photo.dataUrl;
      }

    } catch (error) {
      // The user closing the camera also lands here, so no alert is needed
      console.error('Camera error:', error);

    } finally {
      this.isTakingPhoto = false;
      this.cdr.detectChanges();
    }
  }

  pickFromGallery() {
    return this.takePhoto(CameraSource.Photos);
  }

  removePhoto() {
    this.photoDataUrl = null;
    this.cdr.detectChanges();
  }

  // True when the field is missing AND the user already tried to submit
  invalid(field: FieldName): boolean {
    if (!this.submitted) {
      return false;
    }

    switch (field) {
      case 'itemName':
        return !this.itemName.trim();
      case 'category':
        return !this.category;
      case 'description':
        return !this.description.trim();
      case 'date':
        return this.reportType === 'FOUND'
          ? !this.dateFound
          : !this.dateLost;
      case 'location':
        return this.reportType === 'LOST' && !this.lastSeenLocation.trim();
      case 'photo':
        return this.reportType === 'FOUND' && !this.photoDataUrl;
      default:
        return false;
    }
  }

  private hasErrors(): boolean {
    const fields: FieldName[] = [
      'itemName',
      'category',
      'description',
      'date',
      'location',
      'photo'
    ];

    return fields.some((field) => this.invalid(field));
  }

  private scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.report-page .has-error');

      firstError?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 50);
  }

  async submitReport() {

    if (!this.reportType || this.isTakingPhoto || this.isSubmitting) {
      return;
    }

    this.submitted = true;

    if (this.hasErrors()) {
      this.cdr.detectChanges();
      this.scrollToFirstError();
      return;
    }

    this.isSubmitting = true;

    try {

      const result = await Preferences.get({
        key: 'findit_reports'
      });

      const reports = result.value
        ? JSON.parse(result.value)
        : [];

      const newReport = {
        id: Date.now(),
        itemName: this.itemName.trim(),
        category: this.category,
        description: this.description.trim(),

        dateFound: this.reportType === 'FOUND'
          ? this.dateFound
          : '',

        dateLost: this.reportType === 'LOST'
          ? this.dateLost
          : '',

        lastSeenLocation: this.reportType === 'LOST'
          ? this.lastSeenLocation.trim()
          : '',

        photo: this.photoDataUrl || '',

        status: this.reportType,

        location: this.reportType === 'FOUND'
          ? 'IT Department Office'
          : this.lastSeenLocation.trim()
      };

      reports.unshift(newReport);

      await Preferences.set({
        key: 'findit_reports',
        value: JSON.stringify(reports)
      });

      this.submittedType = this.reportType;
      this.showSuccess = true;

      this.resetForm();
      this.reportType = null;

    } catch (error) {

      console.error('Report saving error:', error);
      alert('Unable to save the report. Please try again.');

    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}