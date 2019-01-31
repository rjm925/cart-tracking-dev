import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employeesCollection: AngularFirestoreCollection<Employee>;
  employeesDoc: AngularFirestoreDocument<Employee>;
  employees: Observable<Employee[]>;
  employee: Observable<Employee>;

  employeeSource = new BehaviorSubject<Employee>({
    id: null, 
    name: null
  });
  selectedEmployee = this.employeeSource.asObservable();

  constructor(private afs: AngularFirestore) {
    this.employeesCollection = this.afs.collection('Employees', ref => ref.orderBy('name','asc'));
  }

  getEmployees(): Observable<Employee[]> {
    // Get carts by id
    this.employees = this.employeesCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Employee;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.employees;
  }

  newEmployee(employee: Employee) {
    this.employeesCollection.add(employee);
  }

  deleteEmployee(employee: Employee) {
    this.employeesDoc = this.afs.doc(`Employees/${employee.id}`);
    this.employeesDoc.delete();
  }

}
