public with sharing class PublishPlatformEvents {
    public static void publishEvent(){

        List<Order_Detail__e> peList = new List<Order_Detail__e>();
        try{
            peList.add(new Order_Detail__e(Order_Number__c='ORD-0002',Generate_Invoice__c=false));
            peList.add(new Order_Detail__e(Order_Number__c='ORD-0003',Generate_Invoice__c=true));
            peList.add(new Order_Detail__e(Order_Number__c='ORD-0004',Generate_Invoice__c=false));
        
                List<Database.SaveResult> results= EventBus.publish(peList);
            
            for(Database.SaveResult result : results){
                if(result.isSuccess()){
                    system.debug('Sucessfully Published Events');
                }else{
                    for(Database.Error error : result.getErrors()){
                        system.debug('Message'+error.getMessage());
                        system.debug('StatusCode'+error.getStatusCode());
                    }
                }
            }
        }catch(Exception ex){
            ExceptionHandlerUtility.logException(ex,'PublishPlatformEvents','publishEvent');
        }

    }
}