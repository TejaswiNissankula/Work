import { LightningElement,api } from 'lwc';

export default class Pagination extends LightningElement {
    
    @api pageSize;
    records;
    visibleRecords;
    currentPage=1;
    totalPages=1;
    hasNext;
    disableNxt;
    //buttonArrayLF;
    //btnAryGF;
    
    @api
    set totalRecords(data){
        if(data){
        this.records = data;
        this.totalPages=Math.ceil(this.records.length/Number(this.pageSize));
        this.updateRecords();
        }
    }
    get totalRecords(){
        return this.visibleRecords;
    }
    get displayPageDetails(){
        return `${this.currentPage} of ${this.totalPages} pages`;
    }
   
    handlePrevious(){
        //if(this.currentPage>1){
            this.currentPage = this.currentPage-1;
            this.updateRecords();
        //}
    }
    handleNext(){
        //if(this.currentPage<this.totalPages){
            this.currentPage = this.currentPage+1;
            this.updateRecords();
        //}
    }
    /*
    handleButtonOnClick(event){
        this.currentPage = event.target.value;
        this.updateRecords();
    }*/
    @api
    updateRecords(){
        let start = (this.currentPage-1)*this.pageSize;
        let end= this.currentPage*this.pageSize - 1;
        this.visibleRecords = this.records.slice(start,end);
        this.disableNxt = (this.currentPage<this.totalPages) ? false : true ; 
        this.disablePrev =this.currentPage>1 ? false:true;
        this.dispatchEvent(new CustomEvent('dataslice',{detail:{records:this.visibleRecords,cPage : this.currentPage}}));
    }
    
}