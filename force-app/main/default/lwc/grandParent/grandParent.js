import { LightningElement } from 'lwc';

export default class GrandParent extends LightningElement {
    test;
    handleNotify(event){
        this.test ="click event listened in grand parent component";
        console.log('grand parent event.target',JSON.stringify(event.target));
        console.log('grand parent event.currentTarget',JSON.stringify(event.currentTarget));
        console.log('grand parent event.detail',JSON.stringify(event.detail));
         //this.dispatchEvent(new CustomEvent('notify'));
    }
}