import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
const columns =[
    { label: 'Name' ,fieldName: 'Name'},
    { label: 'Number Of Employees' ,fieldName: 'NumberOfEmployees'}
];
export default class CustomAccountListView extends LightningElement {

    searchString;
    columns = columns;
    timeoutId;
    result;
    data;
    error;
    displaySize = 200;
    //totalRecordsSize =0;
   // curPageNo =1;
    //totalPages=1;
   // dataMap=[];
    //hasPrevious=false;
    //hasNext=false;
    /*get displayPageDetails(){
        return `${this.curPageNo} of ${this.totalPages} pages`;
    }*/
    @wire(getAccounts,{searchString : "$searchString"})
    accounts({data,error}){
        if(data){
            console.log('data',data)
            this.data= data;
            console.log(`data ::`,this.data);
           /* this.totalRecordsSize = this.data.length;
           this.totalPages = Math.ceil(this.totalRecordsSize/this.displaySize);
           this.generateDataMap();
            if(this.totalPages >this.curPageNo){
                this.hasNext = false;
            }
            console.log('this.hasNext'+this.hasNext);
            console.log('this.hasPrevious'+this.hasPrevious);*/
        }else {
            this.error = error
        }
    }
    
    handleSearchKeyChange(event){
        window.clearTimeout(this.timeoutId);
         console.log(event.target.value)
        const key =event.target.value;
         // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timeoutId = setTimeout(()=>{
            if(key){
                this.searchString = key;
                this.result=[];
                //this.dataMap=[];
            }
        },300);
    }

    handleDataChange(event){
        this.result = event.detail.records;
    }
   /* generateDataMap(){
        let i=1;
        let pageLevelData =[];
       for (const [index,item] of this.data.entries()) {
        console.log('this.data',this.data)
        console.log('item',item)
        console.log('index',index);
            pageLevelData.push(item);
            console.log('pageLevelData.length',pageLevelData.length);
            console.log('his.displaySize',this.displaySize);
            console.log('this.totalPages',this.totalPages);
            console.log('i',i);
            console.log('this.data.indexOf(item)',this.data.indexOf(item));
            console.log('this.totalRecordsSize - 1)',(this.totalRecordsSize - 1));
            if(pageLevelData.length ===this.displaySize || (pageLevelData.length <=this.displaySize && this.totalPages === i && index === (this.totalRecordsSize - 1))){
                console.log('insdie if loop'+JSON.stringify(pageLevelData));
                console.log('this.dataMap',this.dataMap);
                this.dataMap.push({pageNo:i,pageData:pageLevelData});
               // [...this.dataMap,{pageNo:i,pageData:pageLevelData}];
                pageLevelData =[];
                ++i;
            }
           console.log('pageLevelData :: ',pageLevelData);
         }
         console.log('dataMap ::',this.dataMap);
         if(this.dataMap.length>0){
            this.result= this.curPageNo>=1 ?this.dataMap[this.curPageNo-1].pageData : this.dataMap[0].pageData;
            console.log('result ::',this.result);
         }
         console.log('hasPrevious ::',this.hasPrevious);
         console.log('hasNext ::',this.hasNext);
         console.log('curPageNo ::',this.curPageNo);
         console.log('totalPages ::',this.totalPages);
    }
    previous(){
        --this.curPageNo;
        if(this.curPageNo <= 1){
            this.hasPrevious = true;
        }
        this.result= this.curPageNo>=1 ?this.dataMap[this.curPageNo-1].pageData : this.dataMap[0].pageData;
    }
    next(){
        ++this.curPageNo;
        if(this.curPageNo >=this.totalPages){
            this.hasNext = true;
        }
        console.log(`this.curPageNo ::`,this.curPageNo)
        console.log(`this.totalPages ::`,this.totalPages)
        console.log(`this.dataMap[this.curPageNo-1].pageData`);
        this.result= this.curPageNo>=1 ?this.dataMap[this.curPageNo-1].pageData : this.dataMap[0].pageData;
        console.log(`this.result ::`,this.result);
    }*/
}