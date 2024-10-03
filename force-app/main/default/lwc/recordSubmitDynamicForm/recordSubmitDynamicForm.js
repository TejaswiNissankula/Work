import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class RecordSubmitDynamicForm extends LightningElement {
    name;

    handleNameChange(event){
        this.name= event.target.value;
    }

    handleOnClick(event){
        if(this.name){
            this.showNotification('Form Submitted Successfully!',`${this.name} Record Created`,'success');
        }else{
            this.showNotification('Form Submission unsuccessful','Record Creation Failed','error');
        }
    }
    showNotification(Title,Msg,Vari){
        this.dispatchEvent(new ShowToastEvent({
            title:Title,
            message:Msg,
            variant :Vari
        }));
    }

}