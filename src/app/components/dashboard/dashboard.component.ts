import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
    private employeeService: EmployeeService,
    private router: Router
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
    if(!this.user.canCreate && this.user.canCreate != null) {
      this.router.navigate(['/processor']);
    }
  }
}
