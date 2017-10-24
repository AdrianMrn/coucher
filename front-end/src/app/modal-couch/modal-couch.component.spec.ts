import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCouchComponent } from './modal-couch.component';

describe('ModalCouchComponent', () => {
  let component: ModalCouchComponent;
  let fixture: ComponentFixture<ModalCouchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
