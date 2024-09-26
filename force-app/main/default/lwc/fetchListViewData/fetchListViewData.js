import { LightningElement,wire } from 'lwc';
import { getListUi } from "lightning/uiListApi";
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class FetchListViewData extends LightningElement {
@wire(getListUi,{objectApiName: ACCOUNT_OBJECT.objectApiName,listViewApiName: "Account_Custom_List_View"})
   accRecords;
   get accData(){
    return this.accRecords.data? this.accRecords.data.records.records:[];
   }
}