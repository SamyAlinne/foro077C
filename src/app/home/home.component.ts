import { Component } from '@angular/core';
import { ApiRestService } from '../api-rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  preguntas = [
    {no:1, pregunta: '¿Cuál es tu nombre?', correo: "", categoria: "", fecha: "", id:""},
  ];
  newP = {categoria:"", pregunta:"", id:""}
  modP = {categoria:"", pregunta:"", id:""}

  constructor(
    private api: ApiRestService, 
    private msg: ToastrService){}

  ngOnInit():void{
    this.consultar()
  }

  consultar(){
    this.api.getAllPreguntas().subscribe({
      next: datos => {
        console.log(datos)
        let documentos = datos.documents.filter( (d: any) => d.hasOwnProperty('fields'))
        let i=1;
        let preguntas = documentos.map( (p: {name:string,fields:any}) => ({
            no: i++,
            pregunta: p.fields.hasOwnProperty('pregunta')? p.fields.pregunta.stringValue: "",
            correo:  p.fields.hasOwnProperty('correo')? p.fields.correo.stringValue: "",
            categoria:  p.fields.hasOwnProperty('categoria')? p.fields.categoria: "",
            fecha:  p.fields.hasOwnProperty('fecha')? p.fields.fecha.timestampValue: "", 
            id: p.name.split("/").pop()
          }))
        console.log(preguntas)
        this.preguntas = preguntas
      },
      error: e => {}
    })
  }

  crearPregunta(){
    const fecha = new Date().toISOString();
    if(this.newP.pregunta=="" || this.newP.categoria==""){
      this.msg.error("Faltan campos por llenar!")
      return;
    }
    const correo = localStorage.getItem("correo") || ""
    this.api.createPregunta(this.newP.pregunta,correo,this.newP.categoria,fecha).subscribe({
       next: resp => {this.consultar()},
       error: e => {console.log(e)}
    })
  }

  eliminarPregunta(id:string){
    this.api.deletePregunta(id).subscribe({
      next: resp => {this.consultar()},
      error: e => {console.log(e)}
    })
  }
  
  modificarPregunta(){
    this.api.updatePregunta(this.modP.pregunta, this.modP.id).subscribe({
      next: resp => {this.consultar(); this.msg.success("Pregunta creada")},
      error: e => {console.log(e); this.msg.error("Error, tu pregunta ta toda mal hecha >:C")}
    })
  }

  editarPregunta(p:any){
    this.modP = JSON.parse(JSON.stringify(p))
  }
}
