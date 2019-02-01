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
        this.employeeService.getUser(auth.email).subscribe(employees => {
          this.user = employees[0];

          if(!this.user.canCreate) this.router.navigate(['/processor']);
          else this.router.navigate(['/']);
        });
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });      
  }
}
