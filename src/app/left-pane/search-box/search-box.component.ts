import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { EcoleDto } from '../../model/ecoleDto.model';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Output() selectedPlaceEvent=new EventEmitter<EcoleDto>();
  @Output() selectedCurrentPlaceEvent=new EventEmitter<string>();
  @Input() ecoles:EcoleDto[]=[];
  @Input() currentLocalisationActive=false;
  @Input() error=false;
  currentPlace="Ma localisation actuelle"

  currentLocalisationDto:EcoleDto=
    {
      nom:this.currentPlace,
      tel:30,
      adresse:{commune:"",departement:""},
      geoLocalisation:{ lat: 0,lng:0},
      link:""
    }

  constructor() { }

  ngOnInit(): void {
    
  }
  
  selectedPlace(ecole:EcoleDto){
    this.selectedPlaceEvent.emit(ecole);
  }

  selectedCurrentPlace(){
    this.selectedCurrentPlaceEvent.emit(this.currentPlace);
  }

  
}
