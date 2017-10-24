import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-modal-couch',
  templateUrl: './modal-couch.component.html',
  styleUrls: ['./modal-couch.component.scss']
})
export class ModalCouchComponent implements OnInit {
  @Input() showMePartially: boolean;
  constructor() { }

  ngOnInit() {
  }

}
