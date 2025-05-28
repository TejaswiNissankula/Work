import { LightningElement,wire } from 'lwc';

import { publish,MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';


export default class ProductFilter extends LightningElement {
    searchKey='';
    price = 10000;
    categoryData;
    categoryError;
    materialData;
    materialError;
    levelData;
    levelError;
    filters={
        category:[],
         material:[],
         level:[],
        searchKey:this.searchKey,
        price:this.price

    };
    masterRecordTypeId = "012000000000000AAA";
    delayTimeout;
    @wire(MessageContext)
    messageContext;
    
    @wire(getPicklistValues,{fieldApiName: CATEGORY_FIELD,recordTypeId: "$masterRecordTypeId"})
    categories({error,data}){
        if(data){
            this.categoryData = data.values;
            this.filters.category  = [...data.values].map(item => item.value);
            
        }else if(error){
            this.categoryError = error;
            console.error('error in category picklist',error);
        }
    }

    @wire(getPicklistValues,{fieldApiName: MATERIAL_FIELD,recordTypeId: "$masterRecordTypeId"})
    materials({error,data}){
        if(data){
            this.materialData = data.values;
            this.filters.material  = [...data.values].map(item => item.value);
            
        }else if(error){
            this.materialError = error;
            console.error('error in material picklist',error);
        }
    };

    @wire(getPicklistValues,{fieldApiName: LEVEL_FIELD,recordTypeId: "$masterRecordTypeId"})
    levels({error,data}){
        if(data){
            this.levelData = data.values;
            this.filters.level  = [...data.values].map(item => item.value);
           
        }else if(error){
            this.levelError = error;
            console.error('error in level picklist',error);
        }
    };
        
    

    handleFilterChange(event){

        if(event.target.type === "checkbox"){

            if(event.target.checked && (! this.filters[event.target.dataset.field].includes(event.target.value))){
                this.filters[event.target.dataset.field].push(event.target.value);
            }else if(!event.target.checked &&(this.filters[event.target.dataset.field].includes(event.target.value)) ){
                const index = this.filters[event.target.dataset.field].indexOf(event.target.value);
                this.filters[event.target.dataset.field].splice(index,1);
            }
        }else{
            this.filters[event.target.dataset.field] = event.target.value;
        }

       
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(()=>{
            const message = {
                filters: this.filters
            };
            publish(this.messageContext,PRODUCTS_FILTERED_MESSAGE,message);
        },500);
    }

}