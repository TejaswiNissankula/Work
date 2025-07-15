public with sharing class CustomIterator implements Iterator<AggregateResult>{
  List<AggregateResult> results ;
  Integer currentIndex ;
    public CustomIterator() {
        currentIndex =0;
        results = [SELECT OwnerId,Sum(Amount) TotalAmt,CALENDAR_YEAR(CloseDate) Year,CALENDAR_MONTH(CloseDate) Month  FROM Opportunity where StageName ='Closed Won' WITH USER_MODE Group BY OwnerId,CALENDAR_YEAR(CloseDate),CALENDAR_MONTH(CloseDate)];

    }
    public AggregateResult next(){
        if(hasNext()){
            return results[currentIndex++];
        }
        else{
            throw new CustomException('No more records to return');
        }
    }
    public Boolean hasNext(){
         return results!=null && !results.isEmpty() && currentIndex < results.size();
    }
    
}