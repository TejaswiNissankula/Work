import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
const columns =[
    { label: 'Name' ,fieldName: 'Name'},
    { label: 'Number Of Employees' ,fieldName: 'NumberOfEmployees'}
];
export default class CustomAccountListView extends LightningElement {

    searchString='';
    timeoutId;

    @wire(getAccounts,{searchString : "$searchString"})
    accounts;

    handleOnChange(event){

        let key =event.target.value;
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(()=>{
            this.searchString = key;
        },3000);
    }
}