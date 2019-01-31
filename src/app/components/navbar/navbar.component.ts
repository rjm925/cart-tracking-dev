import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { Employee } from '../../models/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  employees: Employee[];
  isLoggedIn: boolean;
  user: Employee = {
    id: null,
    name: null,
    email: null,
    canCreate: null
  }

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.employeeService.getEmployees().subscribe(employees => {
          this.employees = employees;
          this.findUser(auth.email);
        });
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  findUser(email) {
    var index = this.employees.map(function(x) {return x.email; }).indexOf(email);
    this.user = this.employees[index];
  }

  onLogoutClick() {
    this.authService.logout();
    this.user = {
      id: null,
      name: null,
      email: null,
      canCreate: null
    }    
  }

}
