import { LightningElement,api,wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import querySelectedChildData from '@salesforce/apex/childRelationShipController.querySelectedChildData';

export default class CustomChildRelationship extends LightningElement {

    @api recordId;
    @api objectApiName;
   
    selectedChild="";
    childRecords;
    childRelationships;
    childParentR=[];
    
    //datatable
    

    @wire(getObjectInfo, { objectApiName: '$objectApiName' }) 
    objectInfo({data,error}){
        if(data){
            console.log('objInfoData -->',data);
            this.childRelationships = data.childRelationships.map((item)=>{
                this.childParentR.push({label:item.childObjectApiName,value:item.fieldName});
                 return {label:item.childObjectApiName,value:item.childObjectApiName} });
        }else if(error){
            console.log('objinfo error -->',error);
        }
    }
    
    
    handleChange(event){
        console.log('this inside event handler -->',this);
        this.selectedChild = event.target.value;
        let parentRShipField =  this.childParentR.find((item)=>{
            return (item.label === this.selectedChild)}
        )?.value;
        this.queryChildData(parentRShipField);
    }
    queryChildData(parentRSField){

        querySelectedChildData({recordId:this.recordId ,parentRelationShipField :parentRSField,childObj :this.selectedChild})
        .then((result)=>{
            this.childRecords = result;
            console.log(this.childRecords);
        })
        .catch((error)=>{
            console.log('error -->',error);
        })
    }

}