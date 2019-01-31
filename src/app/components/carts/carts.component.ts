import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/Cart';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent implements OnInit {
  date = new Date().toLocaleDateString();
  carts: Cart[];
  showMore: boolean = false;
  isLoggedIn: boolean;
  average: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
    this.cartService.getTodayCarts().subscribe(carts => {
      this.carts = carts;
      this.findTime();
    });
  }

  onSelect(cart: Cart) {    
    this.cartService.setFormCart(cart);
  }

  onDelete(cart: Cart) {
    if(confirm('Are you sure?')) {
      this.cartService.deleteCart(cart);
    }
  }

  findTime() {
    var completeTime = 0;
    var completeCarts = 0;

    for(var i = 0; i < this.carts.length; i++) {
      var cart = this.carts[i];
      var start = cart.timeStart.split(':');
      var finish = cart.timeFinish.split(':');
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
  }
}
