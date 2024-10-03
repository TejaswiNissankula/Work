import { LightningElement,wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getRecord ,updateRecord} from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';

const gRFields =[FIRSTNAME_FIELD,LASTNAME_FIELD];
export default class UpdateRecordByDynamicForm extends LightningElement {
    disabled = false;
    data;
    error;
    contactId ='003ak0000065xdWAAQ';
    @wire(getRecord,{recordId:'003ak0000065xdWAAQ',fields:gRFields})
    contactRec({data,error}){
        if(data){
            console.log('data::',data);
            this.data=data;
        }else{
            console.log('error:: ',error)
            this.error = error;
        }
    }
    
    handleChange(event){
        if(!event.target.value){
            event.target.reportValidity();
            this.disabled = true;
        }else{
            this.disabled = false;
        }
    }

    handleUpdate(){
        const allValid =[...this.template.querySelectorAll('lightning-input')].reduce(
            (validSoFar,inputField)=>{
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            },true);

         if(allValid){
            const fields ={};
            fields[ID_FIELD.fieldApiName] = this.contactId;
            console.log('this.data.fields.FirstName.value ',this.data.fields.FirstName.value);
            console.log('this.data.fields.LastName.value ',this.data.fields.LastName.value);
            console.log('this.template.querySelector.FirstName value ',this.template.querySelector('[data-field="FirstName"]').value);
            console.log('this.template.querySelector.LastName value ',this.template.querySelector('[data-field="LastName"]').value);
            fields[FIRSTNAME_FIELD.fieldApiName] = this.template.querySelector('[data-field="FirstName"]').value;
            fields[LASTNAME_FIELD.fieldApiName] = this.template.querySelector('[data-field="LastName"]').value;
            const recordInput = { fields };
            updateRecord(recordInput)
            .then(()=>{
                this.dispatchEvent(new ShowToastEvent({
                    title:'Record Updated',
                    message:'Record Updated Successfully',
                    variant:'success'
                }))
            })
            .catch(()=>{
                this.dispatchEvent(new ShowToastEvent({
                    title:'Record Update Failed!',
                    message:'Record Update Failed!',
                    variant:'error'
                }))
            })

         }else{
            this.dispatchEvent(new ShowToastEvent({
                title:'Validation Failed!',
                message:'Please fill all the fields',
                variant:'error'
            }))
         }   
    }

}