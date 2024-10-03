import { LightningElement,api } from 'lwc';
import { ShowToastEvent }from 'lightning/platformShowToastEvent'
import { NavigationMixin } from 'lightning/navigation';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';

export default class DynamicFormCreateRecord extends NavigationMixin(LightningElement) {

    fields=[NAME_FIELD,TYPE_FIELD,INDUSTRY_FIELD,RATING_FIELD,ACTIVE_FIELD];
    @api objectApiName;
    recId;
    handleError(event){
        console.log(event);
        this.showNotification('Failed Record Creation!',event.detail.message,'error');
    }
    handleSuccess(event){
        console.log('inside success event : ',event);
        this.recId = event.detail.id;
        this.showNotification('Record Created Successfully!',event.detail.id+' ','success');
        this.navigateToRecordPage();
    }

    showNotification(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({
            title : title,
            message :message,
            variant : variant
        }));
    }
    navigateToRecordPage(){
        this[NavigationMixin.Navigate]({
            type:"standard__recordPage",
            attributes:{
                recordId:this.recId,
                objectApiName:this.objectApiName,
                actionName:"view"
            }
        })
        
    }
}