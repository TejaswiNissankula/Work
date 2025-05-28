import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ChildNavigationComponent extends NavigationMixin(LightningElement) {
   

    @api recId;
    /*handleNavigation(pageRef){
        try{
        this[NavigationMixin.Navigate](pageRef);
        }catch(error){
            this.dispatchEvent(new ShowToastEvent({
                title:'Error occured in Modal child component',
                message:error.message,
                variant:'error'
            }))
        }
    }*/
}