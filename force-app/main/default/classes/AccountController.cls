public with sharing class AccountController {


    @AuraEnabled(cacheable = true)
    public static List<Account> getAllAccounts(){
        try{
            if(!schema.sObjectType.Account.isAccessible()){
                throw new CustomException('Login user donot have access to Account Object');
            }
        return [select Id,Name from Account WITH USER_MODE Limit 50000];
        }catch(Exception ex){
           throw new AuraHandledException(ex.getTypeName()+ex.getMessage());
        }
    }

    
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
   

    //get case and contact related data of specific account
    @AuraEnabled(cacheable=true)
    public static resultWrapper getRelatedData(string AccountId){
        try{
            if(string.isBlank(AccountId)){
                throw new customException('Invalid Account Id');
            }
            ResultWrapper rwrap = new ResultWrapper();
            if(Schema.SObjectType.Case.isAccessible()){
                List<case>  caseList =[select Id,CaseNumber,Subject,Status from Case where AccountId = :AccountId and Status!= 'Closed'];
                SObjectAccessDecision secureCaseRecs = Security.stripInaccessible(AccessType.READABLE, caseList);
                rwrap.relatedCases = secureCaseRecs.getRecords();
            }
            if(Schema.SobjectType.Contact.isAccessible()){
                 List<Contact> contactList  = [Select Id,FirstName,LastName,Email,Phone from Contact where AccountId = :AccountId];
                SObjectAccessDecision secureContactRecs = Security.stripInaccessible(AccessType.READABLE, contactList);
                rwrap.relatedContacts = secureContactRecs.getRecords();
             }
             return rwrap;
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
    public class ResultWrapper {
        @AuraEnabled public List<case> relatedCases;
        @AuraEnabled public List<Contact> relatedContacts;
    }
   
}