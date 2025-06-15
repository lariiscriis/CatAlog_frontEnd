import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprestadosComponent } from './emprestados.component';

describe('EmprestadosComponent', () => {
  let component: EmprestadosComponent;
  let fixture: ComponentFixture<EmprestadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprestadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprestadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
