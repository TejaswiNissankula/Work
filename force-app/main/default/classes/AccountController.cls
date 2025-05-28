public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(string searchString){
        List<Account> accList = new List<Account>();
        try {
            for(List<Account> accRec: [select Id,Name,NumberOfEmployees,AnnualRevenue,SLAExpirationDate__c from Account where Name LIKE : ('%'+searchString + '%')]){
                accList.addAll(accRec);
            }
            system.debug('accList ::'+accList);
            return accList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static resultWrapper getTestData(Integer recordsLimit,string lastRecId){
        try {
            Integer limitSet = recordsLimit;
            string query ;
            string lastRetrivedId = lastRecId;
            if(string.isBlank(lastRetrivedId)){
                query ='select Id,Name,NumberOfEmployees__c from TestData__c ORDER BY Id Limit :limitSet';
            }else{
                query ='select Id,Name,NumberOfEmployees__c from TestData__c where Id > :lastRetrivedId ORDER BY Id LIMIT :limitSet';
            }
            List<TestData__c> results = Database.query(query,AccessLevel.USER_MODE);
            resultWrapper rW = new resultWrapper();
            rW.recordsList = results;
            for(Integer i=0;i<results.size();i++){
                system.debug('recId- '+i+': '+results[i]);
            }
            rW.lastRetrivedId = results[results.size()-1].Id;
            return rW;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public with sharing class ResultWrapper{
       @AuraEnabled public List<TestData__c> recordsList {get;set;}
       @AuraEnabled public string lastRetrivedId {get;set;}
    }

    @AuraEnabled
    public static void updateTestRecords(List<TestData__c> recordsList){
       
            if(recordsList.size()>0){
                system.debug('recordList--> '+recordsList);
                if(!Schema.SObjectType.TestData__c.isUpdateable()){
                    throw new DmlException('Insufficient access to update TestData records');
                }
                SObjectAccessDecision securityDecision=Security.stripInaccessible(AccessType.UPDATABLE, recordsList);
                List<TestData__c> recs = securityDecision.getRecords();
                update recs;
            }
            
        
    }
}