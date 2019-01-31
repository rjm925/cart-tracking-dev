import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tester } from '../models/Tester';

@Injectable({
  providedIn: 'root'
})
export class TesterService {
  testersCollection: AngularFirestoreCollection<Tester>;
  testersDoc: AngularFirestoreDocument<Tester>;
  testers: Observable<Tester[]>;
  tester: Observable<Tester>;

  testerSource = new BehaviorSubject<Tester>({
    id: null, 
    name: null
  });
  selectedTester = this.testerSource.asObservable();

  constructor(private afs: AngularFirestore) {
    this.testersCollection = this.afs.collection('Testers', ref => ref.orderBy('name','asc'));
  }

  getTesters(): Observable<Tester[]> {
    // Get carts by id
    this.testers = this.testersCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Tester;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.testers;
  }

  newTester(tester: Tester) {
    this.testersCollection.add(tester);
  }

  deleteTester(tester: Tester) {
    this.testersDoc = this.afs.doc(`Testers/${tester.id}`);
    this.testersDoc.delete();
  }

}
