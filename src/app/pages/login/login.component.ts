import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  imports: [DefaultLoginLayoutComponent, ReactiveFormsModule, PrimaryInputComponent],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastrService: ToastrService

  ) {
    this.loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.loginService.login(email, password).subscribe({
      next: () =>{
      this.toastrService.success("Login realizado com sucesso!");
      localStorage.setItem("email", this.loginForm.value.email);
    setTimeout(() => {
          if (this.loginForm.value.email === 'admin@gmail.com') {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['user']);
          }
        }, 1000);
      },
      error: () => this.toastrService.error("Falha no login. Verifique seus dados e tente novamente.")
    })

      setTimeout(() => {
        this.router.navigate(["user"]);
      }, 1000);
    
}

  navigate(){
    this.router.navigate(["signup"]);
  }
}
