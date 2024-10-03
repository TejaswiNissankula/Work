import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord }from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';

export default class CreateRecordByDynamicForm extends LightningElement {
    recId;
    recName;

    handleNameChange(event){
        //this.recId = undefined;
         this.recName = event.target.value;
    }

    async handleRecCreation(){
        try{
            const fields ={};
            fields[NAME_FIELD.fieldApiName]= this.recName;
            const recordInput ={apiName : ACCOUNT_OBJECT.objectApiName,fields};
            const accRec = await createRecord(recordInput);
            this.recId = accRec.id;
            this.showNotification('SUCCESS','Record Created successfully!!','success')
        }catch(error){
            this.showNotification('FAILED',error.message,'error');
        }
    }
    showNotification(tit,msg,vrnt){
        this.dispatchEvent(new ShowToastEvent({
            title:tit,
            message:msg,
            variant:vrnt
        }));
    }
}