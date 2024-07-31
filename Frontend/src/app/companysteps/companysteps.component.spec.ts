import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanystepsComponent } from './companysteps.component';

describe('CompanystepsComponent', () => {
  let component: CompanystepsComponent;
  let fixture: ComponentFixture<CompanystepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanystepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanystepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
