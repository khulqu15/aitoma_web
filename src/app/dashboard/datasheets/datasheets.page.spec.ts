import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasheetsPage } from './datasheets.page';

describe('DatasheetsPage', () => {
  let component: DatasheetsPage;
  let fixture: ComponentFixture<DatasheetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasheetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
