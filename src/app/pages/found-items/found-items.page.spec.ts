import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoundItemsPage } from './found-items.page';

describe('FoundItemsPage', () => {
  let component: FoundItemsPage;
  let fixture: ComponentFixture<FoundItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
