import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cart } from '../models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  date: string = new Date().toLocaleDateString();
  cartsCollection: AngularFirestoreCollection<Cart>;
  cartDoc: AngularFirestoreDocument<Cart>;
  carts: Observable<Cart[]>;
  cart: Observable<Cart>;

  cartSource = new BehaviorSubject<Cart>({
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
  selectedCart = this.cartSource.asObservable();

  constructor(private afs: AngularFirestore) {
    // this.cartsCollection = this.afs.collection('Carts', ref => ref.orderBy('date','desc').orderBy('timePick','desc'));
    // this.cartsCollection = this.afs.collection('Carts', ref => ref.where("date", "==", "1/30/2019").where("processor","==","Bruce"));
  }

  getCarts(): Observable<Cart[]> {
    this.cartsCollection = this.afs.collection('Carts', ref => ref.orderBy('date','desc').orderBy('timePick','desc'));
    this.carts = this.cartsCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Cart;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.carts;
  }

  getTodayCarts(): Observable<Cart[]> {
    this.cartsCollection = this.afs.collection('Carts', ref => ref.where("date", "==", this.date).orderBy('timePick','desc'));
    this.carts = this.cartsCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Cart;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.carts;
  }

  getProcessorCarts(name): Observable<Cart[]> {
    this.cartsCollection = this.afs.collection('Carts', ref => ref.where("date", "==", this.date).where("processor", "==", name).orderBy('timePick','desc'));
    this.carts = this.cartsCollection.snapshotChanges().pipe(
      map(changes => changes.map(action => {
        const data = action.payload.doc.data() as Cart;
        data.id = action.payload.doc.id;
        return data;
      }))
    );
  
    return this.carts;
  }

  newCart(cart: Cart) {
    this.cartsCollection.add(cart);
  }

  setFormCart(cart: Cart) {
    this.cartSource.next(cart);
  }

  updateCart(cart: Cart) {
    this.cartDoc = this.afs.doc(`Carts/${cart.id}`);
    this.cartDoc.update(cart);
  }

  deleteCart(cart: Cart) {
    this.cartDoc = this.afs.doc(`Carts/${cart.id}`);
    this.cartDoc.delete();
  }
}