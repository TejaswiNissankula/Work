import { LightningElement } from 'lwc';

export default class Child extends LightningElement {
    test;

    handleNotify(event){
        this.test ="Notify event listened in child component";
        console.log('child event.target',event.target);
        console.log('child event.currentTarget',event.currentTarget);
        console.log('child event.detail',JSON.stringify(event.detail));
        //this.dispatchEvent(new CustomEvent('notify',{detail:'new'}));
    }
    handleDivNotify(event){
        console.log('child div event.target',event.target);
        console.log('child div event.currentTarget',event.currentTarget);
        console.log('child  div event.detail',event.detail);
    }
}