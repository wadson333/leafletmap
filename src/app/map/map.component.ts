import { Component, OnInit,AfterViewInit,OnChanges } from '@angular/core';
import  * as L  from 'leaflet'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit,OnChanges {
  map!:L.Map;
  constructor() { }


  ngOnInit(): void {
  }
 
  ngAfterViewInit(){
    this.addMap()
  }

  ngOnChanges(){
    console.log("change")
  }

  //map initialisation 
  addMap(){
    this.map = L.map('map',{
      center:[18.509640864733182,-72.2307899249769],
      zoom:12
    })
    this.addLayer()
  }

  //map layer initialisation 
  addLayer(){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      minZoom:12,
      maxZoom:20,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
    ).addTo(this.map)
  }
}
