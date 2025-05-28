import { LightningElement } from 'lwc';
import fetchException from '@salesforce/apex/FetchExpectionLogs.fetchException';

export default class ValidateUserContextCursor extends LightningElement {

    fetchData;
    error;
    fetchExceptionLogData(){
        fetchException()
        .then((data)=>{
            this.fetchData=data;
            this.error=undefined;
        })
        .catch((error)=>{
            this.error=JSON.stringify(error);
            console.log('error-->',this.error)
            this.fetchData=undefined;
        })
    }

}