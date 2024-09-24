import { LightningElement } from 'lwc';

export default class DynamicForm extends LightningElement {

    selectedValue;
    showInputFields;
    showButtons;
    options=[
        {label:"Select the value to display form dynamicallu",value :""},
        {label:"Input Fields",value:"InputFields"},
        {label:"Buttons",value:"Buttons"}]
    handleOnChange(event){
        this.selectedValue = event.target.value;
        this.showInputFields = this.selectedValue === "InputFields";
        this.showButtons = this.selectedValue === "Buttons";
    }
}