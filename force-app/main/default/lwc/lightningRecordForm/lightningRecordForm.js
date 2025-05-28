import { LightningElement,api } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import SUBTYPE_FIELD from '@salesforce/schema/Account.Sub_Type__c';

export default class LightningRecordForm extends LightningElement {
    @api recordId;
    @api objectApiName;
    
    //= ACCOUNT_OBJECT.objectApiName;
    //import ACCOUNT_OBJECT from '@salesforce/schema/Account';
    fields =[
    NAME_FIELD,
    PHONE_FIELD,
    TYPE_FIELD,SUBTYPE_FIELD];

    // how to handle errors in base components?
    
}