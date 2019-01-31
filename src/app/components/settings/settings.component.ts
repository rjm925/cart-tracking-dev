import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/Employee';
import { TesterService } from '../../services/tester.service';
import { Tester } from '../../models/Tester';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  employee: Employee = {
    id: null,
    name: ""
  }
  tester: Tester = {
    id: null,
    name: ""
  }
  user: Employee = {
    id: null,
    name: null,
    email: null,
    canCreate: null
  }
  employees: Employee[];
  testers: Tester[];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private testerService: TesterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.employeeService.getEmployees().subscribe(employees => {
          this.employees = employees;
          this.findUser(auth.email);
        });
      }
    });
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
    this.testerService.getTesters().subscribe(testers => {
      this.testers = testers;
    });
  }

  findUser(email) {
    var index = this.employees.map(function(x) {return x.email; }).indexOf(email);
    this.user = this.employees[index];
    if(!this.user.canCreate) {
      this.router.navigate(['/']);
    }
  }

  addEmployee({value, valid}: {value: Employee, valid: boolean}) {
    if(valid) {
      var duplicate = this.employees.map(function(x) {return x.name; }).indexOf(value.name);
      if(duplicate == -1) {
        this.employeeService.newEmployee(value);
        this.clearState();
      }  
    }
  }

  addTester({value, valid}: {value: Tester, valid: boolean}) {
    if(valid) {
      this.testerService.newTester(value);
      this.clearState();
    }
  }

  hireTester(value: Tester) {
    var hire: Employee = {
      name: value.name
    }
    this.employeeService.newEmployee(hire);
    this.deleteTester(value);
  }

  deleteEmployee(employee: Employee) {
    if(confirm('Are you sure?')) {
      this.employeeService.deleteEmployee(employee);
    }
  }

  deleteTester(tester: Tester) {
    if(confirm('Are you sure?')) {
      this.testerService.deleteTester(tester);
    }
  }

  clearState() {
    this.employee = {
      id: null,
      name: ""
    }
    this.tester = {
      id: null,
      name: ""
    }
  }
}
