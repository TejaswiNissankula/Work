public with sharing class BatchRepRevenueScheduler implements Schedulable {
   
    public void execute(SchedulableContext sc){
        Database.executeBatch(new BatchApexTotalRevenueByRep());
    }
}