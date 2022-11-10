import { Component, OnInit,ViewChild,ElementRef,ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { EcoleDto } from "../model/ecoleDto.model";
import { DirectionService } from "../service/direction.service";
import { SearchBoxComponent } from "./search-box/search-box.component";
import { SearchDirective } from "./search.directive";
import { Subscription } from "rxjs";
import { Localisation } from '../model/localisation.model';
import { RouteInfo } from '../model/route.model';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit {
  @ViewChild("depart",{static:false}) depart:ElementRef;
  @ViewChild("destination",{static:false}) destination:ElementRef;
  @ViewChild("transport",{static:false}) transport:ElementRef;
  @ViewChild(SearchDirective,{static:false}) searchContent:SearchDirective;
  
  private searchContentRef:ViewContainerRef;
  private closeSearch:Subscription;
  private searchBoxMouseOver=false;
  private currentLocalisationText="Ma localisation actuelle";
  private currentLocalisation:Localisation;

  errorMessage="";
  localisationA:Localisation;
  localisationB:Localisation;
  
  leftpaneToggle={
    toggle:false,
    imgPath:"./assets/img/open-arrow.svg" 
  };

  routedetailsToggle={
    toggle:false,
    currentIcon:`<i class="fal fa-chevron-down"></i>`,
    iconUp:`<i class="fal fa-chevron-up"></i>`,
    iconDown:`<i class="fal fa-chevron-down"></i>`
  }

  routeInfo:RouteInfo[]=[];

  ecoleList:EcoleDto[]=[];
  
  constructor(private directionService:DirectionService,private searchoxFactory:ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.ecoleList=this.directionService.ecoleList;
  }
  
  
  //le moyen de transport a changer
  transportChange(){
    this.getDirection();
  }
 
  //afiiche la direction demande par l'utisateur en fonction du transport type
  getDirection(){
    if(this.localisationA && this.localisationB){
      try {
          if(this.localisatioEgale(this.localisationA,this.localisationB)){
            this.errorMessage="Votre point de départ et votre point d'arriver sont identiques."
          }else{
            this.directionService.directionEvent.next({transportType:this.transport.nativeElement.value,depart:this.localisationA,destination:this.localisationB})
            this.directionService.transferRouteInfo.subscribe(info=>{
              this.routeInfo=info;
              //console.log(info)
            })
            this.errorMessage="";
          }   
         // console.log(this.transport.nativeElement.value)
      } catch (error) {
          this.errorMessage=`On ne peut pas afficher la direction que vous demander.  
          Veuillez vérifier les écoles sélectionner.`;
      }
    }else{
      this.errorMessage=`On ne peut pas afficher la direction que vous demander.
            Veuillez vérifier les écoles sélectionner. `;
    }
  }

  routeStepMouseOver(i:number){
    console.log(i)
    this.directionService.mouseOverStep.next(i)
  }

  routeStepMouseOut(i:number){
    this.directionService.mouseOutStep.next(i)
  }

  routeStepClick(i:number){
    this.directionService.clickStep.next(i)
  }
  
  setRouteInfo(){
    
  }
  localisatioEgale(l1:Localisation,l2:Localisation):boolean{
    return  l1.lat==l2.lat && l1.lng==l2.lng;
  }

  routeSelected(index:number){
    this.directionService.routeSelected.next(index)
  }
  
  /*
    //add the search ox to the screen 
  */
  addSearchBox(element:HTMLInputElement){
    const factory= this.searchoxFactory.resolveComponentFactory(SearchBoxComponent);
    let departText=this.depart.nativeElement.value;
    let destinationText=this.destination.nativeElement.value;

    this.searchContentRef=this.searchContent.viewContainerRef;
    this.searchContentRef.clear();
    
    const cmpRef =this.searchContentRef.createComponent(factory);
    cmpRef.instance.ecoles=this.ecoleList;

    cmpRef.instance.currentLocalisationActive=(departText==this.currentLocalisationText || departText=="En train de vous localiser...")
                                                || (destinationText==this.currentLocalisationText || destinationText=="En train de vous localiser...");

    this.closeSearch=cmpRef.instance.selectedPlaceEvent.subscribe((ecole)=>{
      this.closeSearch.unsubscribe()
      element.value=ecole.nom;
      this.searchBoxMouseOver=false;
      this.reinitializeMapLocaction(element,ecole.geoLocalisation)
      this.directionService.markerEvent.next({ecole:ecole,type:element.name=="depart"? 1 : 2});
     // this.ecoleList=[];
      this.searchContentRef.clear();
    })

    this.closeSearch=cmpRef.instance.selectedCurrentPlaceEvent.subscribe(nom=>{
      this.closeSearch.unsubscribe();
      this.getCurrentLocalisation(element,nom);
      this.searchBoxMouseOver=false;
      //this.ecoleList=[];
      this.searchContentRef.clear();
    })
  }

  /*
    //remove the seach box compenent to the screen
  */
  removeSearchBox(){
    if(!this.searchBoxMouseOver){
        this.searchContentRef.clear();
        this.closeSearch.unsubscribe()
    }
  }

  /*
    //get user current localisaton
  */
  getCurrentLocalisation(element:HTMLInputElement,text:string){
    navigator.geolocation.getCurrentPosition((position)=>{
      this.currentLocalisation={ lat:position.coords.latitude, lng:position.coords.longitude}
      this.reinitializeMapLocaction(element,this.currentLocalisation)
      element.value=text;
      this.directionService.getLoc(position.coords.latitude,position.coords.longitude).subscribe(data=>{
        console.log(data)
      })
      this.directionService.markerEvent.next({currentPlace:{nom:text,position:this.currentLocalisation},type:element.name=="depart"? 1 : 2});
      element.disabled=false;
      
    });
    element.value="En train de vous localiser...",
    element.disabled=true;  
  }


  private reinitializeMapLocaction(element:HTMLInputElement,loc:Localisation):void{
    if(element.name=="depart"){
      this.localisationA=loc;
    }else {
      this.localisationB=loc;
    }
    this.removeMarker(element);
  }

  /*
    //keydow event to load the scools from the api
  */
  keyUpTextChange(event:KeyboardEvent,element:HTMLInputElement){
      const text=element.value.trim().toLowerCase();
        this.reinitializeMapLocaction(element,null);
      // if(event.key==="Enter" &&(!text.match("lycee") || text=="" || !text.match("college"))) { 
      //     //call app
      //     //this.ecoleList=[]
      // }  
      
  }

  keyDownTextChange(event:KeyboardEvent,element:HTMLInputElement){
    if(event.key=="Backspace" && element.value==this.currentLocalisationText){
      element.value="";
      this.removeSearchBox();
      this.setSearchBoxDisplay(element);
    }
    this.reinitializeMapLocaction(element,null);
  }

  
  removeMarker(element:HTMLInputElement){
    this.directionService.removeMaker.next(element.name=="depart"? 1 : 2);
  }
   /*
    //mouse event for searchox
  */
  mouseOver(){
    this.searchBoxMouseOver=true;
  }

  mouseLeave(){
    this.searchBoxMouseOver=false;
  }

  //toggle map visibility 
  leftPaneToggle(){
      this.leftpaneToggle.toggle=!this.leftpaneToggle.toggle;
      this.leftpaneToggle.imgPath=this.leftpaneToggle.toggle ? "./assets/img/close-arrow.svg":"./assets/img/open-arrow.svg";
  }
    
  //change la visisibilite du composent search box, et recupere l'elemnt html
  setSearchBoxDisplay(element:HTMLInputElement){
    this.errorMessage="";
    this.addSearchBox(element);
  }

  routeDetailsToggle(){
    this.routedetailsToggle.toggle=!this.routedetailsToggle.toggle;
    this.routedetailsToggle.currentIcon=this.routedetailsToggle.toggle ? this.routedetailsToggle.iconUp :this.routedetailsToggle.iconDown;
  }
}
