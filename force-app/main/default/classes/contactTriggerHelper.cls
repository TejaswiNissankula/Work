public with sharing class contactTriggerHelper {
    
    public void updateAccountData(List<Id> accIdList){
        try{
            if(accIdList.size() > 0){
                set<Id> accIdSet = new set<Id>(accIdList);
                Map<Id,Account> accUpdateMap = new Map<Id,Account>();
                for(aggregateResult ar : [select count(Id)totalContacts ,AccountId from Contact where AccountId IN :accIdList GROUP BY AccountId]){
                    Account acc = new Account();
                    acc.Id = (Id)ar.get('AccountId');
                    acc.Total_Contacts__c = (Integer)ar.get('totalContacts');
                    accUpdateMap.put(acc.Id,acc);
                }
                if(accUpdateMap.size() > 0 ){
                    if(accIdSet.size() > accUpdateMap.size() ){
                        accIdSet.removeAll(accUpdateMap.keySet());
                        if(accIdSet.size() > 0){
                            for(Id accId : accIdSet){
                                Account acc = new Account();
                                acc.Id = accId;
                                acc.Total_Contacts__c = 0;
                                accUpdateMap.put(acc.Id,acc);
                            }
                        }
                    }
                    update accUpdateMap.values();
                } 
            }
            
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHelper','updateAccountData');
        }
    }
}