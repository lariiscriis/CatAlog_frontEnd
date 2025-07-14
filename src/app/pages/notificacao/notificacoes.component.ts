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
            .sort((a, b) =>
              (b.data_notificacao as Date).getTime() -
              (a.data_notificacao as Date).getTime()
            );
        },
        error: (err) => console.error('Erro ao buscar notificações:', err)
      });
    }
  }
}

function parseDateString(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const semFração = dateStr.split('.')[0];
  const iso = semFração.replace(' ', 'T');
  return new Date(iso);
}
