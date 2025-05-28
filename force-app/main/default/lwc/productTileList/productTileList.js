import { LightningElement,wire } from 'lwc';
import  getProducts  from '@salesforce/apex/ProductController.getProducts';

import { publish,MessageContext,subscribe } from 'lightning/messageService';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';

export default class ProductTileList extends LightningElement {
    errors;
    products;
    selectedProductId;
    filters={};
    @wire(MessageContext)
    messageContext;

   // searchKey = 'E';
    @wire(getProducts,{filters : "$filters"})
    productRecs({error,data}){
        console.log('inside controller method js')
        if(data){
            this.products = data;
            console.log('inside data loop js',data);
        }else{
            this.errors = error;
            console.log('inside error loop js',error);
        }
    }
    productsFilterSubscription;
    connectedCallback(){
        // subscribe to ProductsFiltered message
        this.productsFilterSubscription = subscribe(this.messageContext,PRODUCTS_FILTERED_MESSAGE,(message) => {
            this.handleFilterChanges(message)});
    }
    
    handleProductSelection(event){
        this.selectedProductId = event.detail;

        const message = {
            productId : this.selectedProductId
        };
       this.handleProductSelectionPublish(message);
        
    }
    handleFilterChanges(message){

        this.filters = {...message.filters};
        this.selectedProductId ='';
        this.handleProductSelectionPublish({
            productId : this.selectedProductId
        });
    }

    handleProductSelectionPublish(message){
        publish(this.messageContext,PRODUCT_SELECTED_MESSAGE,message);
    }

}