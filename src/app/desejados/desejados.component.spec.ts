import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesejadosComponent } from './desejados.component';

describe('DesejadosComponent', () => {
  let component: DesejadosComponent;
  let fixture: ComponentFixture<DesejadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesejadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesejadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
