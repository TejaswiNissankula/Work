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
    /*createDynamicButtonArray(){
        if(this.totalPages<=5){
            this.buttonArrayLF= [...Array(this.totalPages).keys()].map(i=>i+1);
        }else{
            if(this.currentPage <5){
                partOne=[...Array(3).keys()].map(i=>i+1);
                partTwo=[...new Array(1).keys().map(i=>'...')];
                partThree=[...Array(1).keys()].map(i=>this.totalPages);
                btnAryGF=[...Array(partOne,partTwo,partThree)];
            }else if(this.currentPage >=5){
                partOne=[...Array(1).keys()].map(i=>1);
                partTwo=[...new Array(1).keys().map(i=>'...')];
                partThree=[...Array(this.totalPages-this.currentPage).keys()].map(i=>this.currentPage+i);
            }
        }
    }*/
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
    handleButtonOnClick(event){
        this.currentPage = event.target.value;
        this.updateRecords();
    }
    @api
    updateRecords(){
        let start = (this.currentPage-1)*this.pageSize;
        let end= this.currentPage*this.pageSize - 1;
        this.visibleRecords = this.records.slice(start,end);
        this.disableNxt = (this.currentPage<this.totalPages) ? false : true ; 
        this.disablePrev =this.currentPage>1 ? false:true;
        this.dispatchEvent(new CustomEvent('dataslice',{detail:{records:this.visibleRecords}}));
    }
    /*get dpd_tPagesLEFive(){
        return (this.totalPages <= 5) ? true : false;
    }*/
}