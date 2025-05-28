/*Trailhead Module Used : JS Maint 24 : brave-koala
Amazon Interview Question : Account has a field = most_used_domain__c . Find most common domain on the  contact emails and stamp it on  most_used_domain__c. 
eg. we have these contacts  a@amazon.com , b@amazon.com, c@yahoo.com, d@yahoo.com, e@yahoo.com 
most_used_domain__c = yahoo.com 
This batch class is one time execution ,there should also a trigger logic for contact on afterInsert,afterUpdate,afterDelete,beforeUndelete to update the account's most used domain based on contacts email*/
public with sharing class AccountDomainCalculation implements Database.Batchable<sObject>,Database.Stateful {
    public Map<Id,Map<string,Integer>> accIdDomainMap = new Map<Id,Map<string,Integer>>();
   
    public Database.QueryLocator start(Database.BatchableContext bc){
        return Database.getQueryLocator([select Id,Email,AccountId from Contact where AccountId!=null AND Email != null with USER_MODE]);
     }
     public void execute(Database.BatchableContext bc,List<contact> contactList){
        List<Account> accUpdateList = new List<Account>();
        try{
            for(contact rec : contactList){
                string domain = rec.email.split('@')[1].toLowerCase();
                if(!accIdDomainMap.containsKey(rec.AccountId)){
                    accIdDomainMap.put(rec.AccountId,new Map<string,Integer>{domain => 1});
                }else{
                Map<string,Integer> domainMap= accIdDomainMap.get(rec.AccountId);
                    if(domainMap.containsKey(domain)){
                        domainMap.put(domain,domainMap.get(domain)+1);
                    }else{
                        domainMap.put(domain,1);
                    }
                    accIdDomainMap.put(rec.AccountId,domainMap);
                }
            }
        
            //find max used domain in an acc
            for(Id accId : accIdDomainMap.keySet()){
                string maxUsedDomain = null;
                Integer maxCount = 0;
                Map<string,Integer> localDomainMap = accIdDomainMap.get(accId);
                for(string domain : localDomainMap.keySet()){
                    if(localDomainMap.get(domain) > maxCount){
                        maxUsedDomain = domain;
                        maxCount = localDomainMap.get(domain);
                    }
                }
                Account acc = new Account();
                acc.Id  = accId;
                acc.MostUsedDomain__c = maxUsedDomain;
                accUpdateList.add(acc);
            }
        
            if(accUpdateList.size()>0){
                //update as user updateAccList;
                Database.SaveResult[] results = Database.update(accUpdateList, false, AccessLevel.USER_MODE);

                for(Database.SaveResult sr : results){
                    if(sr.isSuccess()){

                    }else{
                        //we can add retry logic if er.getMessage() contains UNABLE_TO_LOCK_ROW
                        for(Database.Error er : sr.getErrors()){
                           system.debug(er.getMessage());
                           system.debug(er.getStatusCode());
                           system.debug(er.getFields()); 
                        }
                    }
                }
            }
            //Below sort functionality is not required you can each easily get maxuseddomain by comparing its valeu directly as mentioned above
            /*
            comparableWrapper[] domainWrapper = new  comparableWrapper[0];
            Map<Id,string> mostUsedAccDomainMap  = new mostUsedAccDomainMap();
            for(Id accId : accIdDomainMap){
                Map<string,Integer> DMap = accIdDomainMap.get(accId);
                for(string domain : DMap.keySet()){
                    domainWrapper.add(new comparableWrapper(domain,DMap.get(domain)));
                }
                domainWrapper.sort();
                Integer index  = domainWrapper.size()-1;
                mostUsedAccDomainMap.put(accId,domainWrapper[index].count);
            }
        
                List<Account> updateAccList = new List<Account>();
                for(Id rec : mostUsedAccDomainMap.keySet()){
                    Account acc = new Account();
                    acc.Id = (Id)rec;
                    acc.most_used_domain__c = mostUsedAccDomainMap.get(rec);
                    updateAccList.add(acc);
                }
                if(updateAccList.isze()>0){
                    update as user updateAccList;
                }*/
        }catch(Exception e){
    
        }
        
    }
        public void finish(Database.BatchableContext bc){
    
        }
    }