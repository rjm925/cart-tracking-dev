import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {
  date = new Date();
  strDate = this.date.getFullYear() + "/" + (this.date.getMonth()+1) + "/" + this.date.getDate();
  carts: any[];
  showMore: boolean = false;
  isLoggedIn: boolean;
  average: number = 0;

  constructor(
    private testService: TestService
  ) { }

  ngOnInit() {
    this.testService.getCarts().subscribe(carts => {
      this.carts = carts;
      if(this.carts.length > 0) {
        this.carts = this.carts[0].carts.sort(this.compare);     
        console.log(this.carts);           
      }
      else {
        this.testService.newDay({
          date: this.strDate,
          carts: []
        })
      }
    });
  }

  compare(a, b) {
    let pickA = a.timePick;
    let pickB = b.timePick;

    let comparison = 0;
    if (pickA > pickB) {
      comparison = -1;
    } else if (pickA < pickB) {
      comparison = 1;
    }
    return comparison;
  }
}
