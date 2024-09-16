import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActuatorsPage } from './actuators.page';

describe('ActuatorsPage', () => {
  let component: ActuatorsPage;
  let fixture: ComponentFixture<ActuatorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
