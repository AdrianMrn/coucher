import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoucherComponent } from './coucher.component';

describe('CoucherComponent', () => {
  let component: CoucherComponent;
  let fixture: ComponentFixture<CoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
