import { LightningElement,wire } from 'lwc';

//Object and field imports
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';

//import obj metadata
import { getPicklistValues,getObjectInfo} from 'lightning/uiObjectInfoApi';

//showToastNotifcation
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

//provisions oppty recs
import getOpportunitesByStage from '@salesforce/apex/OpportunityController.getOpportunitesByStage';

//reduce Error message
import {reduceErrorsFunction} from 'c/reduceErrorsService';
const COLUMNS=[
        {label:'Name',fieldName:'Name',sortable:true},
        {label:'Stage Name',fieldName:'StageName',sortable:true},
        {label:'Amount',fieldName:'Amount',sortable:true,type:'currency'},
         {label:'Close Date',fieldName:'CloseDate',sortable:true,type:'date',typeAttributes:{year:'numeric',month:'long',day:'2-digit'}}
    ];
export default class DisplayOpportunitesByStage extends LightningElement {

    opptyStageOptions;
    selectedStage='';
    opptyRecs;
    sortBy='Amount';
    sortDirection='ASC';
    columns=COLUMNS.slice(0,3);
    showClosedDate = false;
    
    @wire(getObjectInfo,{objectApiName:OPPORTUNITY_OBJECT})
    opptyObjInfo;

    @wire(getPicklistValues,{recordTypeId:'$opptyObjInfo.data.defaultRecordTypeId',fieldApiName:STAGENAME_FIELD})
    wiredOpportunityStageNames({data,error}){
        if(data){
            this.opptyStageOptions = data.values.map((item)=>({label:item.label,value:item.value}));
            this.opptyStageOptions.unshift({label:'All Stages',value:''});
            this.error = undefined
        }else if(error){
            this.error = reduceErrorsFunction(error).join(',');
            this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
        }
    }

    @wire(getOpportunitesByStage,{stageName:'$selectedStage',orderByField:'$sortBy',orderBy:'$sortDirection'})
    wiredOpptyRec({data,error}){
        if(data){
           this.error = undefined; 
           this.opptyRecs = data;
        }else if(error){
            console.log('error -->',error);
            this.opptyRecs = undefined;
            this.error = reduceErrorsFunction(error).join(',');
            this.notifyUser({title:'Error!!',message:this.error,variant:'error'});
        }
    }

    //below method invoked when stageName is changed
    handleChange(event){
        this.selectedStage = event.detail.value;
    }

    //below method executes when there is change in sorting
    handleSortChange(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }

    //
    handleColumnChange(event){
        this.showClosedDate =event.detail.checked;
        if(this.showClosedDate){
            this.columns = COLUMNS
        }else{
            this.columns = COLUMNS.slice(0,3);
        }
    }

    notifyUser(context){
        this.dispatchEvent(new ShowToastEvent({
            title:context.title,
            message:context.message,
            variant:context.variant
        }));
    }
}