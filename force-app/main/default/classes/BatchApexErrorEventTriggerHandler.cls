public with sharing class BatchApexErrorEventTriggerHandler {

    public static void afterInsert(List<BatchApexErrorEvent> errorEventList){
        set<Id> jobIds = new set<Id>();
        for(BatchApexErrorEvent event : errorEventList){
            jobIds.add(event.asyncApexJobId);
        }
        Map<Id,AsyncApexJob> asyncapexMap = new Map<Id,AsyncApexJob>([select Id,ApexClass.Name from AsyncApexJob where Id IN : jobIds]);
        List<Task> taskList = new List<Task>();
        for(BatchApexErrorEvent event : errorEventList){
            if(asyncapexMap.get(event.asyncApexJobId).ApexClass.Name == 'BatchApexErrorHandWithPlatformEvents'){
                for(string recId: event.JobScope.split(',')){
                    Task t = new Task();
                    t.whatId = (Id)recId;
                    t.subject=event.ExceptionType;
                    t.description = event.Phase+':'+event.message;
                    taskList.add(t);
                }
            }
        }
        if(taskList.size()>0){
            try{
                insert taskList;
            }catch(Exception e){
                ExceptionHandlerUtility.logException(e,'BatchApexErrorEventTriggerHandler','afterInsert');
            }
        }
    }
}