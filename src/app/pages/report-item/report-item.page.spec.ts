import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportItemPage } from './report-item.page';

describe('ReportItemPage', () => {
  let component: ReportItemPage;
  let fixture: ComponentFixture<ReportItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
