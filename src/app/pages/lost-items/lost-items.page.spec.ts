import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostItemsPage } from './lost-items.page';

describe('LostItemsPage', () => {
  let component: LostItemsPage;
  let fixture: ComponentFixture<LostItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LostItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
