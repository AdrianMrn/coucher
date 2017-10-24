import { Component, ElementRef, Input, OnInit, OnDestroy  } from '@angular/core';

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss']
})
export class ModalNameComponent implements OnInit {
  @Input() showMePartially: boolean;
  constructor() { }

  ngOnInit() {
  }

}
