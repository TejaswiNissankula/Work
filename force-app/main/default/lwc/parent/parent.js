import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    test;
    handlyNotify(event){
        this.test ="click event listened in parent component";
        console.log('parent event.target',JSON.stringify(event.target));
        console.log('parent event.currentTarget',JSON.stringify(event.currentTarget));
        console.log('parent event.detail',JSON.stringify(event.detail));
         //this.dispatchEvent(new CustomEvent('notify'));
    }
}