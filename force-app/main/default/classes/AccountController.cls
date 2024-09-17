public with sharing class AccountController {
    
    @AuraEnabled
    public static List<Account> getAccounts(string SearchString){
        List<Account> accList = new List<Account>();
        try {
            for(List<Account> accRec: [select Id,Name,NumberOfEmployees from Account where Name LIKE : (SearchString + '%')]){
                accList.addAll(accRec);
            }
            return accList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}