import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import {reduceErrorsFunction} from 'c/reduceErrorsService';
const columns = [
    { label: 'Name', fieldName: 'Name', sortable: true, type: 'text' },
    { label: 'Number Of Employees', fieldName: 'NumberOfEmployees', sortable: true, type: 'number' },
    { label: 'AnnualRevenue', fieldName: 'AnnualRevenue', sortable: true, type: 'currency' },
    { label: 'SLAExpirationDate', fieldName: 'SLAExpirationDate__c', sortable: true, type: 'date' }
];
export default class CustomAccountListView extends LightningElement {

    searchString = '';
    columns = columns;
    timeoutId;
    result;
    data;
    error;
    displaySize = 5;
    sortBy;
    sortDirection;
    orderData;
   
    currPage;
    wiredAccountData;

    globalSelectedRowIds=[];
    currentSelectedRowIds=[];

    @wire(getAccounts, { searchString: "$searchString" })
    accounts(result) {
        this.wiredAccountData = result;
        const { data, error } = result;
        if (data) {
            console.log('data', data)
            this.data = data;
            console.log(`data ::`, this.data);
        } else {
            this.error = error
        }
    }

    handleSearchKeyChange(event) {
        window.clearTimeout(this.timeoutId);
        console.log(event.target.value)
        const key = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timeoutId = setTimeout(() => {
            
                this.searchString = key;
                this.result = [];
            
        }, 300);
    }

    handleDataChange(event) {
        this.result = event.detail.records;
        this.currPage = event.detail.cPage;
        this.globalSelectedRowIds =[...this.globalSelectedRowIds];
    }

    // Sort Logic
    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.orderData = [...this.data];
        this.orderData.sort(this.compareValues(this.sortBy,this.sortDirection));
        this.data = this.orderData;
    }
    //custom comapre function
    compareValues(key, order) {
        return function (a, b) {
            try {
                //checking does the object has key in it
                if (!Object.hasOwn(a, key) || !Object.hasOwn(b, key)) {
                    return 0;
                }
                const x = a[key];
                const y = b[key];
                if (typeof x === 'string' && typeof y === 'string') {
                    const xLower = x.toLowerCase();
                    const yLower = y.toLowerCase();

                    //AlphaNumeriv value comparison using method localeCompare()
                   /* if (key === 'Name') {
                        let value = xLower.localeCompare(yLower, 'en', { numeric: true });
                        return (order === 'desc') ? value * -1 : value;
                    }*/
                    //string comparison logic
                    let comparison = 0;
                    if (xLower > yLower) {
                        comparison = 1;
                    } else if (xLower < yLower) {
                        comparison = -1;
                    }
                    return (order === 'desc') ? comparison * -1 : comparison;
                } else if ((typeof x === 'number' && typeof y === 'number') || (typeof x === 'date' && typeof x === 'date')) {
                    //number comparison logic
                    return (order === 'desc') ? (y - x) : x - y;
                }
            } catch (error) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error While Sorting !!',
                    message: reduceErrorsFunction(error).join(','),
                    variant: 'error'
                }));
            }
        }
    }
    handleRowSelection(event) {
        try{
            this.currentSelectedRowIds = event.detail.selectedRows?.map((item)=>item.Id);
             switch (event.detail.config.action){
                case 'selectAllRows':
                    this.currentSelectedRowIds.forEach((item)=>{
                        if(!this.globalSelectedRowIds.includes(item)){
                            this.globalSelectedRowIds.push(item);
                        }
                    });
                    break;
                case 'rowSelect':
                    if(!this.globalSelectedRowIds.includes(event.detail.config.value)){
                        this.globalSelectedRowIds.push(event.detail.config.value);
                    }
                    break;
                case 'deselectAllRows':
                    let currentPageRowIds = this.result.map((item)=> item.Id);
                    let gSelectedRowIds_allRowsDesel= this.globalSelectedRowIds.filter((item)=> !currentPageRowIds.includes(item));
                    this.globalSelectedRowIds = [...gSelectedRowIds_allRowsDesel];
                    break;
                case 'rowDeselect':
                    let gSelectedRowIds_rowDesel = this.globalSelectedRowIds.filter((item)=> item!==event.detail.config.value);
                    this.globalSelectedRowIds = [...gSelectedRowIds_rowDesel];
                    break;
             }

        }catch(error){
            this.dispatchEvent(new ShowToastEvent({
                title:'Error on Row Selection',
                message:reduceErrorsFunction(error).join(','),
                variant:'error'

            }))
        }
    }
}