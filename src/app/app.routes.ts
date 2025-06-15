import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import {UserComponent} from './pages/user/user.component';
import {AuthGuard} from './services/auth-guard.service';
import { LandingComponent } from './pages/landing/landing.component';
import {PerfilUsuarioComponent} from './pages/perfil-usuario/perfil-usuario.component';
import {FavoritosComponent} from './favoritos/favoritos.component';
import {EmprestadosComponent} from './emprestados/emprestados.component';
import {DesejadosComponent} from './desejados/desejados.component';
import {HistoricoemprestimoComponent} from './historicoemprestimo/historicoemprestimo.component';

export const routes: Routes = [
    {
        path: "",
        component: LandingComponent
    },
    {
        path: "login",
        component: LoginComponent
    },

    {
        path: "signup",
        component: SignupComponent
    },
    {
      path: "user",
      component: UserComponent,
      canActivate: [AuthGuard] //apenas usuarios autenticados podem acessar essa rota
    },

    {
      path: 'perfil-usuario',
      component: PerfilUsuarioComponent,
      canActivate: [AuthGuard]
    },

      {
      path: 'favoritos',
      component: FavoritosComponent,
      canActivate: [AuthGuard]
    },

  {
    path: 'emprestados',
    component: EmprestadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'desejados',
    component: DesejadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historico-emprestimo',
    component: HistoricoemprestimoComponent,
    canActivate: [AuthGuard]
  },


];
