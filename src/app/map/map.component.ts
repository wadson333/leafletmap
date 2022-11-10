import { Component, OnInit,AfterViewInit,OnChanges,OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import  * as L  from 'leaflet'
import  'leaflet-routing-machine'

import { DirectionService } from "../service/direction.service";
import { EcoleDto } from '../model/ecoleDto.model';
import { CurrentPlace } from '../model/currentplace.model';
import { Localisation } from '../model/localisation.model';
import { RouteInfo } from '../model/route.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit,OnChanges,OnDestroy {
  map:L.Map;
  directionSubject:Subscription;
  addMarkerSubject:Subscription;
  routeInfo:RouteInfo[]=[];
  markerRound=L.circleMarker([0,0], {
      radius: 5,
      color: '#03f',
      fillColor: 'white',
      opacity: 1,
      fillOpacity: 0.7
  })

  layerGroup= new L.LayerGroup();
  route:L.Routing.Control;
  routeTable;

  markerA=L.marker([0,0],{
    icon:new L.Icon({
      iconUrl: L.Icon.Default.prototype.options.iconUrl,
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    opacity:1,
  });

  markerB=L.marker([0,0],{
    icon:new L.Icon({
      iconUrl: './assets/img/marker-green.png',
      iconSize:L.Icon.Default.prototype.options.iconSize,
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
    opacity:1,
  });

  constructor(private directionService:DirectionService) { }

  ngOnInit(): void {
    this.setDirection();
    this.setMarker()
    this.removeMarker();
    this.routeStepMouseOver()
    this.routeStepMouseOut()
    this.routeStepClick()
    this.routeSelected()
  }
 
  ngAfterViewInit(){
    this.addMap()
  }

  ngOnChanges(){
  }

  ngOnDestroy(){
    this.directionSubject.unsubscribe();
    this.addMarkerSubject.unsubscribe();
  }

  //map initialisation 
  addMap(){
    this.map = L.map('map',{
      center:[18.509640864733182,-72.2307899249769],
      zoom:12
    })
    this.addLayer()
    this.layerGroup.addTo(this.map)
  }

  //map layer initialisation 
  addLayer(){
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      minZoom:12,
      maxZoom:20,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)
  }

  setDirection(){
    this.directionSubject=this.directionService.directionEvent.subscribe(direction=>{
        this.direction(direction.transportType,direction.depart,direction.destination);
    })
  }

  setMarker(){
    this.addMarkerSubject=this.directionService.markerEvent.subscribe(model=>{
        console.log(model);
        this.addMarker(model.type==1?this.markerA:this.markerB,model.ecole,model.currentPlace);
    })
  }

  direction(transportType:string,pointA:Localisation,pointB:Localisation){
    const plan=new L.Routing.Plan(
      [L.latLng(pointA),L.latLng(pointB)],
      {
        draggableWaypoints:false,
        addWaypoints:false,
        createMarker:function(){return null}
      })

    if(this.route ){
      this.map.removeControl(this.route);
    }
    this.route =L.Routing.control({
      router: L.Routing.osrmv1({
        language: 'fr', profile:"foot", 
      }),
      plan:plan,
      showAlternatives: false,
      fitSelectedRoutes: true,
      show: true,
      routeWhileDragging: false,
      useZoomParameter:false,
      addWaypoints:false,
      autoRoute:true,
    })
    this.route.on('routesfound',e=>{
      let h="",  d="" ,name="",
      routeStepInfo:{text:string, distance:string, iconName:string,time:string,index:number}[]=[],inst:L.Routing.IInstruction[]=[],o:L.Routing.IRoute
      const formatter=new L.Routing.Formatter();
      for (let index = 0; index < e.routes.length; index++) {
         h =formatter.formatTime(e.routes[index].summary.totalTime);
         d =formatter.formatDistance(e.routes[index].summary.totalDistance)
         this.routeTable=e.routes;
         name =e.routes[index].name;
         inst =e.routes[index].instructions;
          for (let i = 0; i < inst.length; i++) {
            const element = inst[i];
              routeStepInfo.push({
                  iconName:formatter.getIconName(element,i),
                  distance:formatter.formatDistance(element.distance),
                  time:formatter.formatTime(element.time),
                  text:element.text,
                  index:Object.values(element)[6]
                });
          }
          this.routeInfo.push({heure:h,distance:d,nom:name,instruction:routeStepInfo});   
      } 
      this.directionService.transferRouteInfo.next(this.routeInfo);
      this.routeInfo=[]
      console.log("found");
    })
    this.selectedRoute(0)
    this.route.addTo(this.map)
  }
  
  routeSelected(){
    this.directionService.routeSelected.subscribe(index=>{
      this.map.removeControl(this.route)
      this.selectedRoute(index)
      // this.route.addTo(this.map)
    })
  }
  selectedRoute(index:number){
    this.route.on('routeselected', e=> {
      e.route=this.routeTable[index]
      console.log(index)
    }).addTo(this.map)
    console.log(index)
  }

  removeMarker(){
    this.directionService.removeMaker.subscribe(markerNumber=>{
      if(this.map.hasLayer(this.markerA) && markerNumber==1){
        this.layerGroup.removeLayer(this.markerA);
      } 
     
      if(this.map.hasLayer(this.markerB) && markerNumber==2){
        this.layerGroup.removeLayer(this.markerB);
      }
      if(this.route ){
        this.map.removeControl(this.route);
      }
    })
  }

  addMarker(marker:L.Marker,ecoleDto?:EcoleDto,currentPlace?:CurrentPlace){
    let text="";
    let lat=null;
    let lng=null;
    if(ecoleDto){
      lat=ecoleDto.geoLocalisation.lat;
      lng=ecoleDto.geoLocalisation.lng;
      text=`<h3> Nom : ${ecoleDto.nom} </h3>
      <h3> Adresse : ${ecoleDto.adresse.commune},${ecoleDto.adresse.departement} </h3>
      <h3> Contact : ${ecoleDto.tel} </h3>
      <h3> Cliquer <a href="${ecoleDto.link}" target="_blank">ici</a>  pour plus de details </h3>`
    }

    else if(currentPlace){
      lat=currentPlace.position.lat;
      lng=currentPlace.position.lng;
      text=`<h3> ${currentPlace.nom} </h3>
      <h3> Latitude : ${lat} </h3>
      <h3> Longitude : ${lng} </h3>`; 
    }
    
    const popUp=new L.Popup();
    popUp.setContent(text);
    marker.bindPopup(popUp).openPopup();

    marker.setLatLng([lat,lng]); 
    this.map.flyTo([lat,lng])

    if(!this.map.hasLayer(marker)){
        this.layerGroup.addLayer(marker);
    }
  }

  routeStepMouseOver(){
    this.directionService.mouseOverStep.subscribe(e=>{
      this.markerRound.setLatLng(this.routeTable[0].coordinates[e])
       this.markerRound.addTo(this.map)
    })
  }

  routeStepMouseOut(){
    this.directionService.mouseOutStep.subscribe(e=>{
       if (this.markerRound) {
        this.map.removeLayer(this.markerRound);
        // delete this.markerRound;
      }
    })
  }

  routeStepClick(){
    this.directionService.clickStep.subscribe(e=>{
      this.markerRound.setLatLng(this.routeTable[0].coordinates[e])
      this.map.panTo(this.routeTable[0].coordinates[e])
      this.markerRound.addTo(this.map)

    })
  }

}
