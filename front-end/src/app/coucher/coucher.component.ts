import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coucher',
  templateUrl: './coucher.component.html',
  styleUrls: ['./coucher.component.scss']
})
export class CoucherComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  showVar: boolean = false;
  constructor() { }

  toggleChild(){
    this.showVar = !this.showVar;
  }

  ngOnInit() {
  }

  remove(event) {
  	event.currentTarget.parentElement.remove();
  }

  event() {
    this.showVar = !this.showVar;
  }

}
