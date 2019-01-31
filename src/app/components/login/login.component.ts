import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  employees: Employee[];
  user: Employee = {
    id: null,
    name: null,
    email: null,
    canCreate: null
  }
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    this.authService.login(this.email, this.password)
      .then(res => {
        this.employeeService.getEmployees().subscribe(employees => {
          this.employees = employees;
          this.findUser((<any>res).user.email);

          if(!this.user.canCreate) this.router.navigate(['/processor']);
          else this.router.navigate(['/']);
        });
      })
      .catch(err => {
        alert(err);
      })
  }

  findUser(email) {
    var index = this.employees.map(function(x) {return x.email; }).indexOf(email);
    this.user = this.employees[index];
  }
}