import { LightningElement } from 'lwc';

export default class GrandChild extends LightningElement {
    test;

    handleOnclick(event){
        this.test ="click event fired in grand child component";
        console.log('grand child event.target',event.target);
        this.dispatchEvent(new CustomEvent('notify',{bubbles:false}));

    }
    handleDivGrandChild(event){
        console.log('div grand child event.target',event.target);
    }
}