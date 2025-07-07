/*Scenario : 
Design a lwc component to display list of case records in lightning-datatable.
Columns should display CaseNumber,Subject,Priority,Status,OwnerName.
The data must be fetched based on current user's team .You can't hardcode id.
The component should be smart enough to know the running user's subordinates.
Dynamic filtering : 
To above data table , add 2 filters dropdowns
Filter by status
Filter by owner (a list of team memmbers who own the currently displayed cases) 
When manager selects a value from any of these dropdowns, the data table must re-render instantly to show only the matching records.This filtering should happen on client side for a fast user experience.
*/

import { LightningElement,wire } from 'lwc';
//obj metadata info
import { getPicklistValues,getObjectInfo } from 'lightning/uiObjectInfoApi';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import CASE_OBJECT from '@salesforce/schema/Case';
// error handling service
import { reduceErrorsFunction } from 'c/reduceErrorsService';
//display messages to user using toastEvent
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
//apex controller to fetch case records
import fetchSubOrdinateCases from '@salesforce/apex/CustomCaseController.fetchSubOrdinateCases';

export default class DisplayTeamCases extends LightningElement {
    statusOptions=[];
    ownerOptions=[];
    selectedStatus='';
    selectedOwner='';
    error;
    caseRecs;
    displayRecords;
    //data table columns
    columns =[
        {label:'CaseNumber',fieldName:'CaseNumber'},
        {label:'Subject',fieldName:'Subject'},
        {label:'Priority',fieldName:'Priority'},
        {label:'Status',fieldName:'Status'},
        {label:'Owner',fieldName:'Owner'}
    ]
    NoRecords= 'No case records to display';
    //get case obj info
    @wire(getObjectInfo,{objectApiName:CASE_OBJECT})
    objInfo;

    // fetch Status picklist field values
    @wire(getPicklistValues,{recordTypeId:'$objInfo.data.defaultRecordTypeId',fieldApiName:STATUS_FIELD})
    statusFieldPicklistInfo({data,error}){
        try{
            if(data){
                this.statusOptions = data.values.map((item)=> ({label:item.label,value :item.value}));
                this.statusOptions=[{label:'All',value:''},...this.statusOptions]
                this.error = undefined;
            }else if(error){
                this.error = reduceErrorsFunction(error).join(',');
                this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
            }
        }catch(e){
            this.error = reduceErrorsFunction(e).join(',');
                this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
        }
    }

    //fetch case records of running user and their subordinates
    @wire(fetchSubOrdinateCases)
    wiredCasee({data,error}){
        if(data){
            try{
            const uniqueOwnerIdSet = new Set();
            let ownerOps =[{label:'All',value:''}];
            //In datatable,we cannot display child to parent or parent to child related fields.
            //hence loop over provisioned case records and assign case owner name to Owner key.
            //If we assign direct case records to data attribut in datatable it wont display case owner name
            // hence we took this approach .Make sure Owner key in the below return case records should match with 
            // fieldName in columns[] that we pass to datatable which acts as mapping between column and data
            this.caseRecs = data?.length>0 ?
            data.map((item)=>{
                if(!uniqueOwnerIdSet.has(item.OwnerId)){
                    uniqueOwnerIdSet.add(item.OwnerId)
                    ownerOps.push({label:item.Owner.Name,value:item.OwnerId}) ;
                }
             return {
                Id:item.Id,
                CaseNumber:item.CaseNumber,
                Subject:item.Subject,
                Priority:item.Priority,
                Status:item.Status,
                OwnerId :item.OwnerId,
                Owner:item.Owner.Name
                }
             }) 
            : [];
            this.displayRecords = this.caseRecs;
            console.log('this.ownerOptions',this.ownerOptions);
            this.ownerOptions= ownerOps;
            debugger;
            this.error = undefined;
            }catch(e){
                this.error = reduceErrorsFunction(e).join(',');
                this.notifyUser({title:'Error!!',message:this.error,variant:'error'}); 
            }
        }else if(error){
        this.error = reduceErrorsFunction(error).join(',');
            this.notifyUser({title:'Error!!',message:this.error,variant:'error'}); 
        }
    }
    //handler method to control the display of records based on filters selected
    handleFilterChange(event){
        try{
            if(event.target.name==='Status'){
                this.selectedStatus = event.detail.value;
            }else if(event.target.name==='OwnerName'){
                this.selectedOwner = event.detail.value;
            }
            console.log('targetname',event.target.name)
            this.handleDisplayRecords();
        }catch(e){
             this.error = reduceErrorsFunction(e).join(',');
            this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
        }
    }
    //helper method to control the display of records based on filters selected 
    handleDisplayRecords(){
        try{
            this.displayRecords = this.caseRecs.filter((rec) =>{
                if(this.selectedStatus && 
                    this.selectedOwner &&
                    rec.Status ===this.selectedStatus &&
                    rec.OwnerId === this.selectedOwner){
                    return rec
                }else if(this.selectedStatus && 
                    !this.selectedOwner &&
                    rec.Status ===this.selectedStatus ){
                        return rec;
                }else if(!this.selectedStatus && 
                    this.selectedOwner &&
                    rec.OwnerId === this.selectedOwner){
                        return rec
                }else if(!this.selectedStatus && 
                    !this.selectedOwner){ return rec}
            })
        }catch(e){
             this.error = reduceErrorsFunction(e).join(',');
            this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
        }
    }

    //generic method to display messages to user.
    notifyUser(messageDetails){
        this.dispatchEvent(new ShowToastEvent({
            title:messageDetails.title,
            message: messageDetails.message,
            variant:messageDetails.variant
        }));
    }
}