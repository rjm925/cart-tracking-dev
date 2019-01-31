import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cart } from '../models/Cart';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  date = new Date();
  strDate = this.date.getFullYear() + "/" + (this.date.getMonth()+1) + "/" + this.date.getDate();
  cartsCollection: AngularFirestoreCollection<Cart>;
  cartDoc: AngularFirestoreDocument<Cart>;
  carts: Observable<Cart[]>;
  cart: Observable<Cart>;

  constructor(private afs: AngularFirestore) {
    this.cartsCollection = this.afs.collection('Test', ref => ref.where("date", "==", this.strDate));
  }

  getCarts(): Observable<Cart[]> {
    this.carts = this.cartsCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Cart;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.carts;
  }

  newDay(test) {
    this.cartsCollection.add(test);
  }
}
