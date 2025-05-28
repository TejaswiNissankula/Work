import { LightningElement,wire } from 'lwc';

import { getFieldValue } from 'lightning/uiRecordApi';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

import PICTURE_FIELD from '@salesforce/schema/Product__c.Picture_URL__c';
import NAME_FIELD from '@salesforce/schema/Product__c.Name';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import FORK_FIELD from '@salesforce/schema/Product__c.Fork__c';
import REAR_FIELD from '@salesforce/schema/Product__c.Rear_Brakes__c';
import FRONT_FIELD from '@salesforce/schema/Product__c.Front_Brakes__c';
import BATTERY_FIELD from '@salesforce/schema/Product__c.Battery__c';
import CHARGER_FIELD from '@salesforce/schema/Product__c.Charger__c';
import MOTOR_FIELD from '@salesforce/schema/Product__c.Motor__c';
import MSRP_FILED from '@salesforce/schema/Product__c.MSRP__c';


import { subscribe,MessageContext } from 'lightning/messageService';
import PRODUCT_SELECETED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';

import {NavigationMixin} from 'lightning/navigation';




export default class ProductCard extends NavigationMixin(LightningElement) {
    
    recordId;
    
    pImage = PICTURE_FIELD;
    pCategory = CATEGORY_FIELD;
    pLevel = LEVEL_FIELD;
    pMSRP = MSRP_FILED;
    pBattery = BATTERY_FIELD;
    pCharger = CHARGER_FIELD;
    pMotor = MOTOR_FIELD;
    pMaterial = MATERIAL_FIELD;
    pFork = FORK_FIELD;
    pRear = REAR_FIELD;
    pFront = FRONT_FIELD;

    productName;
    productImage;

    @wire(MessageContext)
    messageContext;

     /** Subscription for ProductSelected Lightning message */
     productSelectionSubscription;
    connectedCallback(){
       this.productSelectionSubscription = subscribe(this.messageContext,PRODUCT_SELECETED_MESSAGE,(message) => {
            this.handleProductSelected(message.productId);
        });
    }

    handleProductSelected(productId){
        this.recordId = productId;
    }

   handleRecordFormLoad(event){
    const {records} = event.detail;
    const recordData = records[this.recordId];
    this.productName = getFieldValue(recordData, NAME_FIELD);
    this.productImage =  getFieldValue(recordData, PICTURE_FIELD);
   }

   handlePageOpen(){
       this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          recordId: this.recordId,
          objectApiName: PRODUCT_OBJECT.objectApiName,
          actionName: 'view'
        }
      });
   }
}