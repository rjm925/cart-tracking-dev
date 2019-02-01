import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../../models/Cart';
import { Employee } from '../../models/Employee';
import { Tester } from '../../models/Tester';
import { CartService } from '../../services/cart.service';
import { EmployeeService } from '../../services/employee.service';
import { TesterService } from '../../services/tester.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  name: string;
  date: string;
  user: Employee = {
    id: null,
    name: null,
    email: null,
    canCreate: null
  }
  carts: Cart[];
  employees: Employee[];
  testers: Tester[];
  filteredCarts: Cart[];
  table1: any[];
  table2: any[];
  average: number;  
  showStats: boolean = false;
  columns: boolean[];

  constructor(
    private cartService: CartService,
    private employeeService: EmployeeService,
    private testerService: TesterService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {    
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.employeeService.getUser(auth.email).subscribe(employees => {
          this.user = employees[0];

          if(!this.user.canCreate && this.user.canCreate != null) this.router.navigate(['/processor']);
          else this.getServiceData();
        });
      } else {
        this.getServiceData();
      }
    });    
  }

  getServiceData() {
    this.cartService.getCarts().subscribe(carts => {
      this.carts = carts
      this.filteredCarts = carts;
      this.calculateSpeed();
      this.countCarts();
      // this.changeName();
    });    
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.allStats(undefined, undefined);
    });
    this.testerService.getTesters().subscribe(testers => {
      this.testers = testers;
    });

    this.cartService.cartSource = new BehaviorSubject<Cart>({
      id: null, 
      cartNumber: null,
      picker: null,
      timePick: null,
      processor: null,  
      timeStart: null,
      timeFinish: null,
      type: null,
      notes: null,
      date: null
    });
    this.cartService.selectedCart = this.cartService.cartSource.asObservable();
  }

  onSearch() {    
    if(this.date != undefined) {
      var searchDate = new Date(this.date.replace(/-/g, '\/')).toLocaleDateString();
    } else {
      searchDate = "Invalid Date";
    }
    if((this.name == undefined || this.name == "") && searchDate == "Invalid Date") {
      this.filteredCarts = this.carts;
      this.allStats(undefined, undefined);
    } else if(this.name != undefined && this.name != "") {
      if(this.name == "Tester") {
        if(searchDate == "Invalid Date") {
          this.filteredCarts = this.carts.filter(cart => cart.picker.includes(this.name) || cart.processor.includes(this.name));
          this.allStats(this.name, undefined);
        } else {
          this.filteredCarts = this.carts.filter(cart => (cart.picker.includes(this.name) || cart.processor.includes(this.name)) && cart.date == searchDate);
          this.allStats(this.name, searchDate);
        }
      } else {
        if(searchDate == "Invalid Date") {
          this.filteredCarts = this.carts.filter(cart => cart.picker == this.name || cart.processor == this.name);
          this.allStats(this.name, undefined);
        } else {
          this.filteredCarts = this.carts.filter(cart => (cart.picker == this.name || cart.processor == this.name) && cart.date == searchDate);
          this.allStats(this.name, searchDate);
        }
      }  
    } else {
      this.filteredCarts = this.carts.filter(cart => cart.date == searchDate);
      this.allStats(undefined, searchDate);
    }
    this.calculateSpeed();
  }

  cartTime(cart: Cart) {
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

    cart.time = time;
    return time;
  }

  calculateSpeed() {
    var totalMinutes = 0;
    var totalCarts = 0;

    for(var i = 0; i < this.filteredCarts.length; i++) {
      var cart = this.filteredCarts[i];
      var time = this.cartTime(cart);
      
      if(!isNaN(time)) {
        totalMinutes += time;
        totalCarts += 1;
      }
    }
    var average = totalMinutes / totalCarts;
    this.average = parseFloat(average.toFixed(2));
  }

  countCarts() {
    var i = 0;
    var d = new Date();
    var numCarts = 0;
    var hold = i;

    do {
      var cart = this.filteredCarts[i];

      if (cart.date == d.toLocaleDateString()) {
        numCarts++;
        i++;
      }
      else {
        for (var j = hold; numCarts > 0; j++, numCarts--) {
          this.filteredCarts[j].index = numCarts;
        }
        hold = i;
        numCarts = 0;
        d.setDate(d.getDate() - 1);
      }
    } while (i < this.filteredCarts.length)

    for (var j = hold; numCarts > 0; j++, numCarts--) {
      this.filteredCarts[j].index = numCarts;
    }
  }

  allStats(name, date) {
    this.table1 = [];
    this.table2 = [];
    this.columns = [false, false, true, false, false, true];

    if(name == undefined && date == undefined) {
      this.columns = [false, true, true, false, false, true];
      for(var i = 0; i < this.employees.length; i++) {
        var employee = this.employees[i];
        this.table2.push({
          name: employee.name,
          total: 0,
          picked: 0,
          processed: 0,
          speed: 0,
          complete: 0,
          minutes: 0
        })
      }

      var i = 0;
      var d = new Date();
      var numCarts = 0;
      var totalMinutes = 0;
      var totalCarts = 0;
      var overall = {
        minutes: 0,
        complete: 0,
        average: 0
      }

      do {
        var cart = this.filteredCarts[i];
        var time = this.cartTime(cart);

        if (cart.date == d.toLocaleDateString()) {
          if(!isNaN(time)) {
            totalMinutes += time;
            totalCarts += 1;
          }

          if(cart.picker.includes("Tester")) var pickPos = this.table2.map(function(x) {return x.name; }).indexOf("Tester");
          else var pickPos = this.table2.map(function(x) {return x.name; }).indexOf(cart.picker);
          var picker = this.table2[pickPos];
          if(picker != undefined) {
            picker.picked++;
            picker.total++;
          }      
          if(cart.processor.includes("Tester")) var processPos = this.table2.map(function(x) {return x.name; }).indexOf("Tester");
          else var processPos = this.table2.map(function(x) {return x.name; }).indexOf(cart.processor);
          var processor = this.table2[processPos];
          if(processor != undefined) {
            processor.processed++;
            processor.total++;

            var time = this.cartTime(cart);

            if(!isNaN(time)) {
              processor.minutes += time;
              processor.complete += 1;
            }
            processor.speed = (processor.minutes/processor.complete).toFixed(2);
          } 
          if(pickPos == processPos && pickPos != -1) picker.total--;

          numCarts++;
          i++;
        }
        else {
          var average = totalMinutes / totalCarts;
          overall.minutes += totalMinutes;
          overall.complete += totalCarts;

          if(numCarts != 0)
            this.table1.push({
              date: d.toLocaleDateString(),
              number: numCarts,
              average: average = parseFloat(average.toFixed(2))
            });
          numCarts = 0;
          totalMinutes = 0;
          totalCarts = 0;
          d.setDate(d.getDate() - 1);
        }
      } while (i < this.filteredCarts.length)

      var average = totalMinutes / totalCarts;
      overall.minutes += totalMinutes;
      overall.complete += totalCarts;
      overall.average = overall.minutes / overall.complete;
      this.table1.push({
        date: d.toLocaleDateString(),
        number: numCarts,
        average: parseFloat(average.toFixed(2))
      });
      this.table1.unshift({
        date: "Overall",
        number: this.filteredCarts.length,
        average: parseFloat(overall.average.toFixed(2))
      })
    } else if(name != undefined && date == undefined) {
      this.columns = [false, true, true, true, true, true];
      var i = 0;
      var d = new Date();
      var numCarts = 0;
      var picked = 0;
      var processed = 0;
      var totalMinutes = 0;
      var totalCarts = 0;
      var overallE = {
        total: 0,
        picked: 0,
        processed: 0,
        minutes: 0,
        complete: 0,
      }

      do {
        var cart = this.filteredCarts[i];
        var time = this.cartTime(cart);

        if (cart.date == d.toLocaleDateString()) {
          if(cart.picker.includes(name)) {
            picked++;
          }
          if(cart.processor.includes(name)) {
            if(!isNaN(time)) {
              totalMinutes += time;
              totalCarts += 1;
            }
            processed++;
          }

          numCarts++;
          i++;
        }
        else {
          var average = totalMinutes / totalCarts;
          overallE = {
            total: overallE.total + numCarts,
            picked: overallE.picked + picked,
            processed: overallE.processed + processed,
            minutes: overallE.minutes + totalMinutes,
            complete: overallE.complete + totalCarts
          }

          if(numCarts != 0)
            this.table1.push({
              date: d.toLocaleDateString(),
              number: numCarts,
              picked: picked,
              processed: processed,
              average: average = parseFloat(average.toFixed(2))
            });
          numCarts = 0;
          picked = 0;
          processed = 0;
          totalMinutes = 0;
          totalCarts = 0;
          d.setDate(d.getDate() - 1);
        }
      } while (i < this.filteredCarts.length)

      var average = totalMinutes / totalCarts;
      overallE = {
        total: overallE.total + numCarts,
        picked: overallE.picked + picked,
        processed: overallE.processed + processed,
        minutes: overallE.minutes + totalMinutes,
        complete: overallE.complete + totalCarts
      }
      this.table1.push({
        date: d.toLocaleDateString(),
        number: numCarts,
        picked: picked,
        processed: processed,
        average: parseFloat(average.toFixed(2))
      });
      this.table1.unshift({
        date: "Overall",
        number: overallE.total,
        picked: overallE.picked,
        processed: overallE.processed,
        average: parseFloat((overallE.minutes/overallE.complete).toFixed(2))
      })
    } else if(name == undefined && date != undefined) {
      this.columns = [true, false, true, true, true, true];
      for(var i = 0; i < this.employees.length; i++) {
        var employee = this.employees[i];
        this.table1.push({
          name: employee.name,
          number: 0,
          picked: 0,
          processed: 0,
          average: 0,
          complete: 0,
          minutes: 0
        })
      }
      
      for(var i = 0; i < this.filteredCarts.length; i++) {
        var cart = this.filteredCarts[i];
        var pickPos = this.table1.map(function(x) {return x.name; }).indexOf(cart.picker);
        var picker = this.table1[pickPos];
        if(picker != undefined) {
          picker.picked++;
          picker.number++;
        }      
        var processPos = this.table1.map(function(x) {return x.name; }).indexOf(cart.processor);
        var processor = this.table1[processPos];
        if(processor != undefined) {
          processor.processed++;
          processor.number++;
  
          var time = this.cartTime(cart);
  
          if(!isNaN(time)) {
            processor.minutes += time;
            processor.complete += 1;
          }
          processor.average = (processor.minutes/processor.complete).toFixed(2);
        } 
        if(pickPos == processPos && pickPos != -1) picker.total--;
      }
    } else {
      this.columns = [false, false, true, true, true, true];
      var picked = 0;
      var processed = 0;
      var complete = 0;
      var minutes = 0;
      for(var i = 0; i < this.filteredCarts.length; i++) {
        var cart = this.filteredCarts[i];
        if(cart.picker.includes(name)) {
          picked++;
        }
        if(cart.processor.includes(name)) {
          processed++;
          var time = this.cartTime(cart);
  
          if(!isNaN(time)) {
            minutes += time;
            complete += 1;
          }
        }
      }
      var average = minutes/complete;

      this.table1.push({
        number: this.filteredCarts.length,
        picked: picked,
        processed: processed,
        average: average.toFixed(2)
      })
    }
  }

  // changeName() {
  //   var current = "Sade";
  //   var replace = "Tester - Sade";
  //   for(var i = 0; i < this.carts.length; i++) {
  //     var cart = this.carts[i];
  //     if(cart.processor == current) {
  //       var update: Cart = {
  //         id: cart.id,
  //         cartNumber: cart.cartNumber,
  //         picker: cart.picker,
  //         timePick: cart.timePick,
  //         processor: replace,  
  //         timeStart: cart.timeStart,
  //         timeFinish: cart.timeFinish,
  //         type: cart.type,
  //         notes: cart.notes,
  //         date: cart.date
  //       }
  //       console.log(update);
  //       this.cartService.updateCart(update);
  //     }            
  //   }
  // }

  // onDelete(cart: Cart) {
  //   if(confirm('Are you sure?')) {
  //     this.cartService.deleteCart(cart);
  //   }
  // }
}