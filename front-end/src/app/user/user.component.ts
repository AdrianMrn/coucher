import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  showVar: boolean = false;
  constructor() { 
  }

  toggleChild(){
	  this.showVar = !this.showVar;
  }

  ngOnInit() {
  }

  event() {
    this.showVar = !this.showVar;
  }
}
