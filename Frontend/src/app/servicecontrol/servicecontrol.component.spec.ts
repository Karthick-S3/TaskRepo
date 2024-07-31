import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecontrolComponent } from './servicecontrol.component';

describe('ServicecontrolComponent', () => {
  let component: ServicecontrolComponent;
  let fixture: ComponentFixture<ServicecontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicecontrolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicecontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
