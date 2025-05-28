import { LightningElement, wire } from 'lwc';
import getTestData from '@salesforce/apex/AccountController.getTestData';
import updateTestRecords from '@salesforce/apex/AccountController.updateTestRecords'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrorsFunction } from 'c/reduceErrorsService';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import ModelServiceComponent from 'c/modelServiceComponent';

const actions = [{ label: 'Show Details', name: 'show_details' }, { label: 'Edit', name: 'edit' }, { label: 'Delete', name: 'delete' }];

export default class DataTableWithInfintieLoading extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference)
    pageRef;
    actions = actions;
    columns = [
        { label: "Id", fieldName: "Id" },
        { label: "Name", fieldName: "Name", sortable: true },
        { label: "No. of Employees", fieldName: "NumberOfEmployees__c", editable: true },
        { type: 'action', typeAttributes: { rowActions: this.actions } }

    ]
    displayRecordsSize = 500;
    displayRecords = [];
    newRetrivedId = '';
    executedIdSet = [];
    loadMoreStatus;
    error;
    sortBy;
    sortDirection = 'asc';
    isCalledFromDelete;
    isCalledFromUpdate;
    draftValues;
    connectedCallback() {
        this.getRecords();
    }


    handleLoadMore(event) {
        const { target } = event;
        target.isLoading = true;
        this.loadMoreStatus = 'Loading..';
        console.log('this.newRetrivedId', this.newRetrivedId);
        console.log('this.executedIdSet', this.executedIdSet)
        if (!this.executedIdSet.includes(this.newRetrivedId)) {
            this.getRecords()
                .then(() => {
                    target.isLoading = false;
                    this.loadMoreStatus = '';
                })
            this.executedIdSet.push(this.newRetrivedId);
        }


    }

    getRecords() {
        let recordLimit;
        let lastRecId;
        if (this.isCalledFromDelete || this.isCalledFromUpdate) {
            recordLimit = this.displayRecords.length > this.displayRecordsSize ? this.displayRecords.length : this.displayRecordsSize;
            lastRecId = '';

        } else {
            recordLimit = this.displayRecordsSize;
            lastRecId = this.newRetrivedId;
        }
        return getTestData({ recordsLimit: recordLimit, lastRecId: lastRecId })
            .then((resultWrapper) => {
                if (resultWrapper.recordsList.length < this.displayRecordsSize) {
                    this.loadMoreStatus = 'No more data to load';
                }
                const results = resultWrapper.recordsList;
                //observation : assigning data using spread operates helps lwc immediatly detect the data changes and renders ui upon assignment compartively using concat function
                if (this.isCalledFromDelete || this.isCalledFromUpdate) {
                    this.displayRecords = [...results];
                    this.isCalledFromDelete= false;
                    this.isCalledFromUpdate= false;
                } else {
                    this.displayRecords = [...this.displayRecords, ...results];
                }

                //this.displayRecords = this.displayRecords.concat(resultWrapper.recordsList);
                this.newRetrivedId = resultWrapper.lastRetrivedId;
                this.error = undefined;
            })
            .catch(((error) => {
                this.error = error;
                this.displayRecords = undefined;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Opps! Something Went wrong',
                    message: reduceErrorsFunction(error).join(','),
                    variant: 'error'
                }))
            }))


    }

    //onsort event handler
    handleSort(event) {
        event.target.isLoading = true;
        console.log(JSON.stringify(event.detail));
        console.log('sortBy -->', this.sortBy);
        const { fieldName, sortDirection } = event.detail;
        console.log('fieldName -->', fieldName);
        console.log('sortDirection -->', sortDirection);
        const clonedData = [...this.displayRecords];
        clonedData.sort(this.compareValues(fieldName, sortDirection));
        this.displayRecords = clonedData;
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;
        event.target.isLoading = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!',
            message: `Sorted rows by ${this.sortBy}`,
            variant: 'success'
        }))
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
                    if (key === 'Name') {
                        let value = xLower.localeCompare(yLower, 'en', { numeric: true });
                        return (order === 'desc') ? value * -1 : value;
                    }
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


    // handle row action event
    handleRowAction(event) {
        console.log('rowAction event --> ', JSON.stringify(event.detail));
        try {
            const action = event.detail.action;
            const row = event.detail.row;

            switch (action.name) {
                case 'show_details':
                    //alert('show Details:: ->'+JSON.stringify(row));
                    this.showRecordDetails(row.Id);
                    break;
                case 'edit':
                    //when inlinedit is enabled for an coloumns then explicit edit action is not required for each row because we can perform bulk update on by clicking on save button after editing fields
                    this.showRecordEdit(row.Id);
                    break;
                case 'delete':
                    this.deleteRecord(row);
                    break;
            }
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error on Row Action Event',
                message: reduceErrorsFunction(error).join(','),
                variant: 'error'
            }))
        }
    }

    async showRecordDetails(recordId) {
        try {

            const result = await ModelServiceComponent.open({
                size: 'medium',
                header: 'Record Detail Page',
                recId: recordId
            });
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error While Dispalying Record Details',
                message: reduceErrorsFunction(error).join(','),
                variant: 'error'
            }))
        }

    }

    showRecordEdit(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'TestData__c',
                recordId: recordId,
                actionName: 'edit'
            }

        })
    }


    async deleteRecord(record) {
        try {
            await deleteRecord(record.Id);
            this.isCalledFromDelete = true;
            await this.getRecords();
            this.isCalledFromDelete = false;
            
            this.dispatchEvent(new ShowToastEvent({
                title: 'Deletion Successful!',
                message: `${record.Name} Record Deleted`,
                variant: 'success'
            }))

        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error Deleting Record',
                message: reduceErrorsFunction(error).join(','),
                variant: 'error'
            }));
        }
    }
    //this is using updateRecord wire adapter i have logic for updating records imperatively for bulk update commented code added just below this function
     handleSave(event) {
        const draftValues = event.detail.draftValues;
        debugger;
        this.draftValues = [];
        const recordInputs = draftValues.slice().map((draft)=>{
                const fields = {...draft}
                return {fields};
            })
            console.log('recordInput--> update call ',recordInputs);
        Promise.all(recordInputs.map((record) => updateRecord(record)))
        .then(()=>{
            this.isCalledFromUpdate = true;
            this.getRecords();
            this.dispatchEvent(new ShowToastEvent({
                title: '',
                message: 'Records Updated Successfully!!',
                variant: 'success'

            }));
        })
        .catch((error)=>{
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error cccured while updating records',
                message: reduceErrorsFunction(error).join(','),
                variant: 'error'

            }));
        })
            
       

    }
    /* async handleSave(event) {
        const draftValues = event.detail.draftValues;
        debugger;
        this.draftValues = [];
        try {
            await updateTestRecords({ recordsList: draftValues });
            

            this.isCalledFromUpdate = true;
            await this.getRecords();
            this.isCalledFromUpdate = false;
            this.dispatchEvent(new ShowToastEvent({
                title: '',
                message: 'Records Updated Successfully!!',
                variant: 'success'

            }));
       } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error cccured while updating records',
                message: reduceErrorsFunction(error).join(','),
                variant: 'error'

            }));
     }

    } */

}