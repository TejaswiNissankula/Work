import { LightningElement } from 'lwc';

export default class MyEventTesting extends LightningElement {
    greetings ='World!';
    handleChange(event){
        this.greetings = event.target.value;
    }
}