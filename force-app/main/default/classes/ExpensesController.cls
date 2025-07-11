public with sharing class ExpensesController {
    @AuraEnabled
    public static List<AggregateResult> getExpenses(Date startDate,Date endDate){
        try {
            return [select Expense_Type__c,SUM(Amount__c) TotalAmount from Expense__c where Expense_Date__c >= :startDate and Expense_Date__c <= :endDate GROUP BY Expense_Type__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void saveFile(string base64Image,string title){
        try {
            ContentVersion cv = new ContentVersion();
            cv.Title = title;
            cv.PathOnClient = title +'.png';
            cv.VersionData = EncodingUtil.base64Decode(base64Image);
            insert cv;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}