import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { MarkerModel } from '../model/marker.model';
import { EcoleDto } from "../model/ecoleDto.model";
import { Localisation } from '../model/localisation.model';
import { DirectionModel } from '../model/direction.model';
import { RouteInfo } from '../model/route.model';


@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  directionEvent=new Subject<DirectionModel>();
  markerEvent=new Subject<MarkerModel>();
  transferRouteInfo=new Subject<RouteInfo[]>();
  mouseOverStep=new Subject<number>();
  mouseOutStep=new Subject<number>();
  clickStep=new Subject<number>();
  removeMaker=new Subject<number>();
  routeSelected=new Subject<number>();

  constructor(private http:HttpClient) { }
  // "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ 
  // position.coords.latitude + "," + position.coords.longitude +"&sensor=false", function(data) {
  //                   console.log(data);

  // xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=YOUR_PRIVATE_TOKEN&lat=" +
  //   lat + "&lon=" + lng + "&format=json", true);

  getLoc(lat:number,lng:number){
    return this.http.get(
      "https://us1.locationiq.com/v1/reverse.php?key=pk.7343f20abc7b980175931640497070a1&lat="+lat
       + "&lon" + lng+"&format=json").pipe( 
        map(data=>{
            console.log(data)
          })
    );
  }

  ecoleList:EcoleDto[]=[
    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat: 18.512322460737316,lng:-72.2604922692101},
      link:"www.blabal.com"
    },

    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat:18.509640864733182,lng:-72.2307899249769},
      link:"www.blabal.com"
    },

    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat:18.509640864733182,lng:-72.2307899249769},
      link:"www.blabal.com"
    },
    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat:18.509640864733182,lng:-72.2307899249769},
      link:"www.blabal.com"
    },
    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat:18.509640864733182,lng:-72.2307899249769},
      link:"www.blabal.com"
    },
    {
      nom:"lycee",
      tel:37567890,
      adresse:{commune:"miragoane",departement:"nippes"},
      geoLocalisation:{ lat:18.509640864733182,lng:-72.2307899249769},
      link:"www.blabal.com"
    }
  ]
}


