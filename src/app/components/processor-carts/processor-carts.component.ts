import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/Cart';
import { Employee } from '../../models/Employee';

@Component({
  selector: 'app-processor-carts',
  templateUrl: './processor-carts.component.html',
  styleUrls: ['./processor-carts.component.css']
})
export class ProcessorCartsComponent implements OnInit {
  user: Employee = {
    id: null,
    name: null,
    email: null,
    canCreate: null
  }
  date = new Date().toLocaleDateString();
  carts: Cart[];
  str: string = "";
  average: number = 0;
  currentCart: Cart = {
    id: null,
    cartNumber: null,
    picker: null,
    timePick: null,
    processor: null,  
    timeStart: null,
    timeFinish: null,
    type: null,
    notes: null,
    date: null,
    procStart: null,
    procFinish: null
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.employeeService.getUser(auth.email).subscribe(employees => {
          this.user = employees[0];
          this.cartService.getProcessorCarts(this.user.name).subscribe(carts => {      
            this.carts = carts;
            this.findTime();
          });
        });
      }
    });
  }

  findTime() {
    var completeTime = 0;
    var completeCarts = 0;

    for(var i = 0; i < this.carts.length; i++) {
      var cart = this.carts[i];
      if(cart.procStart == undefined) cart.procStart = "";
      if(cart.procFinish == undefined) cart.procFinish = "";

      if(cart.timeStart == "") var start = cart.procStart.split(':');
      else var start = cart.timeStart.split(':');
      if(cart.timeFinish == "") var finish = cart.procFinish.split(':');
      else var finish = cart.timeFinish.split(':');

      var startH = parseInt(start[0]);
      var startM = parseInt(start[1]);
      var finishH = parseInt(finish[0]);
      var finishM = parseInt(finish[1]);
      var time = 0;

      if(startM > finishM) {
        finishH -= 1;
        time += finishM + 60 - startM;
      } else { 
        time += finishM - startM;
      }
      time += (finishH - startH)*60;

      if(start[0]+start[1] <= "1000" && finish[0]+finish[1] >= "1015") time -= 15;
      if(start[0]+start[1] <= "1200" && finish[0]+finish[1] >= "1230") time -= 30;
      if(start[0]+start[1] <= "1400" && finish[0]+finish[1] >= "1415") time -= 15;

      if(!isNaN(time)) {
        completeTime += time;
        completeCarts += 1;
      }

      cart.time = time;
      cart.index = this.carts.length - i;
    }

    var average = completeTime / completeCarts;
    this.average = parseFloat(average.toFixed(2));
    this.findCart();
  }

  findCart() {
    for(var i = this.carts.length; i > 0; i--) {
      if(isNaN(this.carts[i-1].time)) {
        this.currentCart = this.carts[i-1];
        break;
      }
      else this.currentCart = {};
    }
  }

  cartStart(cart) {
    var time = new Date();

    if(time.getHours() < 10) var h = "0" + time.getHours();
    else var h = "" + time.getHours();
    if(time.getMinutes() < 10) var m = "0" + time.getMinutes();
    else var m = "" + time.getMinutes();

    cart.procStart = h + ":" + m;
    this.cartService.updateCart(cart);
    this.findTime();    
  }

  cartStop(cart) {
    var time = new Date();
    
    if(time.getHours() < 10) var h = "0" + time.getHours();
    else var h = "" + time.getHours();
    if(time.getMinutes() < 10) var m = "0" + time.getMinutes();
    else var m = "" + time.getMinutes();

    cart.procFinish = h + ":" + m;
    this.cartService.updateCart(cart);
    this.findTime();    
  }

  displayStart(cart: Cart) {
    if(cart.timeStart == "") return cart.procStart;
    else return cart.timeStart;
  }

  displayFinish(cart: Cart) {
    if(cart.timeFinish == "") return cart.procFinish;
    else return cart.timeFinish;
  }
}