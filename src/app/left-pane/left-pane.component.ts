import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit {
  leftpaneToggle={
    toggle:false,
    imgPath:"./assets/img/close-arrow.svg" 
  };
  
  constructor() { }

  ngOnInit(): void {
  }
  

  //toggle map visibility 
  leftPaneToggle(){
    this.leftpaneToggle.toggle=!this.leftpaneToggle.toggle;
    this.leftpaneToggle.imgPath=this.leftpaneToggle.toggle ? "./assets/img/open-arrow.svg":"./assets/img/close-arrow.svg";
  }
}
