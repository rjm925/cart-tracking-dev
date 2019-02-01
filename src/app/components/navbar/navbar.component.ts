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
        this.employeeService.getUser(auth.email).subscribe(employees => {
          this.user = employees[0];
        });
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
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
