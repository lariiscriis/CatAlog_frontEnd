import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NotificacaoService, Notificacao } from '../../services/notificacao.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss']
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao[] = [];

  constructor(
    private notificacaoService: NotificacaoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
  const usuario = this.usuarioService.getUsuarioAtual();
  if (usuario) {
    this.notificacaoService.listarPorUsuario(usuario.id).subscribe({
      next: (notifs) => {
        this.notificacoes = notifs
          .map(notif => ({
            ...notif,
            data_notificacao: parseDateString(notif.dataNotificacao as any),
            data_devolucao: parseDateString(notif.dataDevolucao as any)
          }))
          .sort((a, b) => (b.data_notificacao as Date).getTime() - (a.data_notificacao as Date).getTime());
      },
      error: (err) => console.error('Erro ao buscar notificações:', err)
    });
  }
}

}
function parseDateString(dateStr: string): Date {
  if (!dateStr) return null as any;

  // Exemplo: "2025-07-19 18:12:57.083264" => "2025-07-19T18:12:57"
  const dateTimePart = dateStr.split('.')[0]; // remove fração de segundos
  const isoString = dateTimePart.replace(' ', 'T');
  return new Date(isoString);
}
