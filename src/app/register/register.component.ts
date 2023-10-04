import { Component } from '@angular/core';
import { ApiRestService } from '../api-rest.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email:string="";
  pass="";
  ShowError=false;
  ShowLoading=false;
  constructor(private api:ApiRestService, private router:Router){  }//inyección de dependencias (componentes)
  registro(){
    this.ShowLoading = true
    this.api.register(this.email,this.pass).subscribe({
      next: good =>{
        this.router.navigate(['/login'])
      },
      error: bad =>{
        this.ShowError = true;
        this.ShowLoading = true;
      }
    })
  }
}
