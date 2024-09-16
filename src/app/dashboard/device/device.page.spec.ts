import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevicePage } from './device.page';

describe('DevicePage', () => {
  let component: DevicePage;
  let fixture: ComponentFixture<DevicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
