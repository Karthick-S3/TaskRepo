import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffGridComponent } from './tariff-grid.component';

describe('TariffGridComponent', () => {
  let component: TariffGridComponent;
  let fixture: ComponentFixture<TariffGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TariffGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TariffGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
