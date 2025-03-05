public with sharing class contactTriggerHandler implements ITriggerHandler{
    public static Boolean contactTriggerDisabled = false;
    public static set<Id> insertSet = new set<Id>();//insert recurssion check set
    public static set<Id> updateSet= new set<Id>(); // update recurssion check set
    public string operationType = string.valueOf(Trigger.operationType);
       
    public Boolean isDisabled(){
        return contactTriggerDisabled;
    }
    
    public void beforeInsert(List<sObject> newContactList){
       
    }
    public void afterInsert(List<sObject> newContactList,Map<Id,sObject> newContactMap){
        try{
            system.debug('trigger.operationType '+Trigger.operationType);
            // check and exist, if logic is already performed for current set of Ids
            if(insertSet != null && insertSet.containsAll(newContactMap.keySet())){
                return;
            }
            
            insertSet.addAll(newContactMap.keySet());//Add all current insert processing Ids in set
            acctUpdchk(newContactList,null,operationType);
            insertSet.removeAll(newContactMap.keySet()); // remove all processed records from set
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHandler',operationType);
        }
    }
    public void beforeUpdate(List<sObject> newContactList, Map<Id, sObject> newContactMap, List<sObject> oldContactList, Map<Id, sObject> oldContactMap){

    }
    public void afterUpdate(List<sObject> newContactList, Map<Id, sObject> newContactMap, List<sObject> oldContactList, Map<Id, sObject> oldContactMap){
        try{
            system.debug('trigger.operationType'+Trigger.operationType);
            // check and exist, if logic is already performed for current set of Ids
            if(updateSet != null && updateSet.containsAll(newContactMap.keySet())){
                return;
            }
            updateSet.addAll(newContactMap.keySet());//Add all current insert processing Ids in set
            acctUpdchk(newContactList,oldContactMap,operationType);
            updateSet.removeAll(newContactMap.keySet()); // remove all processed records from set
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHandler',operationType);
        }
    }
    public void beforeDelete(List<sObject> oldContactList, Map<Id, sObject> oldContactMap){

    }
    public void afterDelete(List<sObject> oldContactList, Map<Id, sObject> oldContactMap){
        try{
        system.debug('trigger.operationType'+Trigger.operationType);
        acctUpdchk(oldContactList,oldContactMap,operationType);
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHandler',operationType);
        }
    }
    public void afterUndelete(List<sObject> newContactList, Map<Id, sObject> newContactMap){
        try{
        system.debug('trigger.operationType'+Trigger.operationType);
        acctUpdchk(newContactList,null,operationType);
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHandler',operationType);
        }
    }
    /* acctUpdchk function is used to collect the accountId from contacts where an account is added/update/removed/undeleted on contacts*/
     public void acctUpdchk(List<sObject> newContactList,Map<Id,sObject> oldContactMap, string typeOfOperation){
        try{
            List<Id> accountUpdateIdList = new List<Id>();
            List<contact> conList = new List<contact>();
            Map<Id,Contact> oldContMap = (Map<Id,Contact>) oldContactMap;
            if(typeOfOperation.containsIgnoreCase('Delete') && oldContMap!= null && oldContMap.size()>0){
                conList =oldContMap.values();
            }else if(newContactList != null && newContactList.size()>0) {
                conList =(List<contact>) newContactList;
            }
            if(conList.size()>0){
                for(contact rec: conList){
                    if(typeOfOperation.containsIgnoreCase('Update') && rec.AccountId != oldContMap.get(rec.Id).AccountId){
                        List<Id> accList = new List<Id>();
                        if(rec.AccountId != null) {
                            accList.add(rec.AccountId);
                        }
                        if(oldContMap.get(rec.Id).AccountId != null){
                             accList.add(oldContMap.get(rec.Id).AccountId);
                        }
                        accountUpdateIdList.addAll(accList);
                    }
                    else if(!typeOfOperation.containsIgnoreCase('Update') && rec.AccountId != null ){
                        accountUpdateIdList.add(rec.AccountId);
                    }
                }
                    
                if(accountUpdateIdList.size() >0){
                    contactTriggerHelper helper = new contactTriggerHelper();
                    helper.updateAccountData(accountUpdateIdList);
                }
            }  
        }catch(Exception ex){
            exceptionHandlerUtility.logException(ex,'contactTriggerHandler','acctUpdchk');
        }    

    }

}