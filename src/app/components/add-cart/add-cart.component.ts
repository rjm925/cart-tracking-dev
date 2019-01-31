import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from '../../models/Cart';
import { Employee } from '../../models/Employee';
import { Tester } from '../../models/Tester';
import { CartService } from '../../services/cart.service';
import { EmployeeService } from '../../services/employee.service';
import { TesterService } from '../../services/tester.service';

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.css']
})
export class AddCartComponent implements OnInit {
  cart: Cart = {
    id: null,
    cartNumber: 0,
    picker: "",
    timePick: "",
    processor: "",  
    timeStart: "",
    timeFinish: "",
    type: "",
    notes: "",
    date: ""
  }
  @ViewChild('cartForm') form: any;
  isNew: boolean = true;
  employees: Employee[];
  testers: Tester[];

  constructor(
    private cartService: CartService,
    private employeeService: EmployeeService,
    private testerService: TesterService
  ) { }

  ngOnInit() {
    this.cartService.selectedCart.subscribe(cart => {
      if(cart.id !== null) {
        this.isNew = false;
        this.cart = {
          id: cart.id,
          cartNumber: cart.cartNumber,
          picker: cart.picker,
          timePick: cart.timePick,
          processor: cart.processor,  
          timeStart: cart.timeStart,
          timeFinish: cart.timeFinish,
          type: cart.type,
          notes: cart.notes,
          date: cart.date
        };
      }
    });
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
    this.testerService.getTesters().subscribe(testers => {
      this.testers = testers;
    });
  }

  onSubmit({value, valid}: {value: Cart, valid: boolean}) {
    if(valid) {
      if(this.isNew) {
        value.date = new Date().toLocaleDateString();
        this.cartService.newCart(value);
      } else {
        this.isNew = true;
        value.id = this.cart.id;
        this.cartService.updateCart(value);
      }
      
      this.clearState();
    }
  }

  clearState() {
    this.cart = {
      id: null,
      cartNumber: 0,
      picker: "",
      timePick: "",
      processor: "",  
      timeStart: "",
      timeFinish: "",
      type: "",
      notes: "",
      date: new Date().toDateString()
    }
  }
}
