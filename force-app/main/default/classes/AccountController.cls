public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(string searchString){
        List<Account> accList = new List<Account>();
        try {
            for(List<Account> accRec: [select Id,Name,NumberOfEmployees from Account where Name LIKE : ('%'+SearchString + '%')]){
                accList.addAll(accRec);
            }
            system.debug('accList ::'+accList);
            return accList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}