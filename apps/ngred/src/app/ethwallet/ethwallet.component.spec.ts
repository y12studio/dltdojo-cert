import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthwalletComponent } from './ethwallet.component';

describe('EthwalletComponent', () => {
  let component: EthwalletComponent;
  let fixture: ComponentFixture<EthwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthwalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
