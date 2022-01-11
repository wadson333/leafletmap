import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { MarkerModel } from '../model/marker.model';
import { EcoleDto } from "../model/ecoleDto.model";
import { Localisation } from '../model/localisation.model';
import { DirectionModel } from '../model/direction.model';


@Injectable({
  providedIn: 'root'
})
export class DirectionService {
  directionEvent=new Subject<DirectionModel>();
  markerEvent=new Subject<MarkerModel>();

  removeMaker=new Subject<number>();

  constructor() { }

  

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


