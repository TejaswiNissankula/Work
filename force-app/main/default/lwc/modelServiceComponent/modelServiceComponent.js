import { api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningModal from 'lightning/modal';

export default class ModelServiceComponent extends LightningModal {

    @api header;

    @api recId;
    

    handleClose() {
        console.log('inside handle close');
        this.close('clicked close button');
        // we can also dispatch an event here and catch it on parent component in modal.open() ,
        //  we can associate an onEventName and use the event details passed in parent component or call a function in parent component. 
    }
}