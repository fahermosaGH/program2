import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'app-reloj',
  imports: [],
  templateUrl: './reloj.html',
  styleUrl: './reloj.css'
})
export class Reloj implements OnInit{
  constructor (){}

public fechDirecta:any;

  ngOnInit(): void {

    setInterval(()=>{
      const d = new Date();
      this.fechDirecta= d.getHours()+":"+d.getMinutes() +":"+d.getSeconds();
                    }
      , 1000);
    throw new Error('Method not implemented.');
  }
  

}
