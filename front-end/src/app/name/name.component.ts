import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {

  showVar: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleChild(){
	  this.showVar = !this.showVar;
  }

  event() {
    this.showVar = !this.showVar;
  }

}
