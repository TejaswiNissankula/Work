import { LightningElement ,api} from 'lwc';

export default class ProductTile extends LightningElement {
    @api selectedProduct;

    handleOnClick(event){
        this.dispatchEvent(new CustomEvent('selected',{ detail:this.selectedProduct.Id }));
    }
}