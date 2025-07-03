/* Scenraio : Design a lwc to display available accounts in system .On selection of account display its related cases and contacts.When there is no data is available to display on related list ,add a message "No related records to display"
Case related List fields : Case number ,Subject,Status
Contacts related list fields : First Name,Last Name ,Email,Phone
Data for cases and contacts should be retrived using single apex method call using account id*/
import { LightningElement,wire } from 'lwc';
import getAllAccounts from '@salesforce/apex/AccountController.getAllAccounts';
import getRelatedData from '@salesforce/apex/AccountController.getRelatedData';

//ShowToastNotification to user about action result
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class AccountRelatedContactsNCases extends LightningElement {


accOptions=[];
error;
selectedOption;
contactRecs;
caseRecs;
caseColumns =[
    {label:'CaseNumber',fieldName:'CaseNumber'},
    {label:'Subject',fieldName:'Subject'},
    {label:'Status',fieldName:'Status'}
];
contactColumns =[
    {label:'FirstName',fieldName:'FirstName'},
    {label:'LastName',fieldName:'LastName'},
    {label:'Email',fieldName:'Email'},
    {label:'Phone',fieldName:'Phone'},
];

connectedCallback(){
  console.log('Connected callback called')
}

//wire method to get all accounts
@wire(getAllAccounts)
accList({data,error}){
    try{
        console.log('wire accList called');
        if(data){
            try{
            this.accOptions =data.map((item)=>
                 ({label:item.Name,value:item.Id})
            );
            console.log('in accList accOptions: ',this.accOptions);
            this.error=undefined;
            }catch(e){
            this.error = e?.message || JSON.stringify(e);
            this.accOptions =undefined;
            this.notfiyUser({
            title:'Oops!!Failed Loading Accounts.Please Contact admin',
            message:this.error,
            variant:'error'
        });
            }
        }else if(error){
            this.error = error;
            this.accOptions =undefined;
            this.notfiyUser({title:'Oops!! Something Went Wrong.Contact Admin',message:this.error,variant :'error'});
            console.log('in accList this.error: ',this.error);
        }
    }catch(e){
        this.error = e?.message || JSON.stringify(e);
        this.accOptions =undefined;
        this.notfiyUser({
            title:'Oops!!Failed Loading Accounts.Please Contact admin',
            message:this.error,
            variant:'error'
        });
        
    }
}

//
/*@wire(getRelatedData,{AccountId : '$selectedOption'})
getCaseNContactRecs({data,error}){
    if(data){
        console.log('data - result wrapper',data);
        if(data.relatedContacts?.length>0){
            this.contactRecs = data.relatedContacts;
        }
        if(data.relatedCases?.lenght>0){
            this.caseRecs = data.relatedCases;
        }
    }else{
        this.error =error;
        this.contactRecs = undefined;
        this.caseRecs = undefined;
        this.notfiyUser({title:'Oops!! Something Went Wrong.Contact Admin',message:this.error,variant :'error'});
        console.log('in getRelatedData this.error: ',this.error);
    }
}*/



//below method is invoked when we switch to different option in Account's drop down
async handleAccChange(event){
    this.selectedOption = event.detail.value;
    try{
    let resultWrapper = await getRelatedData({AccountId:this.selectedOption});
    if(resultWrapper?.relatedContacts?.length >0){
        this.contactRecs = resultWrapper?.relatedContacts;
    }
    if(resultWrapper?.relatedCases?.length >0){
        this.caseRecs = resultWrapper?.relatedCases;
    }
    }catch(error){
        this.error = error?.message || JSON.stringify(error);
        this.notfiyUser({title:'Oops!! Something Went Wrong.Contact Admin',message:this.error,variant :'error'});
    }

}
//below method notify user about action result
notfiyUser(msgDetials){
    this.dispatchEvent(new ShowToastEvent({
        title: msgDetials.title,
        message: msgDetials.message,
        variant : msgDetials.variant
    }))
}

}