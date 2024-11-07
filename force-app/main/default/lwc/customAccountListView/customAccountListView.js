import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
const columns =[
    { label: 'Name' ,fieldName: 'Name',sortable: true ,type :'text'},
    { label: 'Number Of Employees' ,fieldName: 'NumberOfEmployees',sortable: true,type:'number'},
    {label:'AnnualRevenue',fieldName:'AnnualRevenue',sortable:true,type:'currency'},
    {label:'SLAExpirationDate',fieldName:'SLAExpirationDate__c',sortable:true,type:'date'}
];
export default class CustomAccountListView extends LightningElement {

    searchString='';
    columns = columns;
    timeoutId;
    result;
    data;
    error;
    displaySize = 200;
    sortBy;
    sortDirection;
    orderData;
    @wire(getAccounts,{searchString : "$searchString"})
    accounts({data,error}){
        if(data){
            console.log('data',data)
            this.data= data;
            console.log(`data ::`,this.data);
        }else {
            this.error = error
        }
    }
    
    handleSearchKeyChange(event){
        window.clearTimeout(this.timeoutId);
         console.log(event.target.value)
        const key =event.target.value;
         // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timeoutId = setTimeout(()=>{
            if(key){
                this.searchString = key;
                this.result=[];
            }
        },300);
    }

    handleDataChange(event){
        this.result = event.detail.records;
    }

    // need to update sort logic for each type : number,string,date,currency,phone.No logic in place .
    handleSort(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        console.log()
        this.orderData = [...this.data];
       this.orderData.sort((a,b)=>{ 
            if(a[this.sortBy] && b[this.sortBy]){
                
                return 0;
            }
       })
        this.data= this.orderData;
    }


}