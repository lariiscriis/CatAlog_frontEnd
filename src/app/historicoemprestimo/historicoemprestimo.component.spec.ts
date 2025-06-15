import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoemprestimoComponent } from './historicoemprestimo.component';

describe('HistoricoemprestimoComponent', () => {
  let component: HistoricoemprestimoComponent;
  let fixture: ComponentFixture<HistoricoemprestimoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoemprestimoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoemprestimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
