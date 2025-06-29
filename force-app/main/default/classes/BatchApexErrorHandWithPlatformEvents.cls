//Refer doc to get context of this class : Interview Prep - Prep Doc - Exception - BatchApex Error Handling
public with sharing class BatchApexErrorHandWithPlatformEvents implements Database.Batchable<SObject>,Database.RaisesPlatformEvents {
   
    public Database.QueryLocator start(Database.BatchableContext bc){
        return Database.getQueryLocator('select Id,Name from Account where Industry = \'Energy\' with USER_MODE');
    }
    public void execute(Database.BatchableContext bc,List<Account> accList){
        List<Account> updAccList = new List<Account>();
        for(Account rec  : accList){
            rec.Name = null;
            updAccList.add(rec);
        }
        update as User updAccList;

    }
    public void finish(Database.BatchableContext bc){
        Messaging.SingleEmailMessage  email = new Messaging.SingleEmailMessage ();
        AsyncApexJob batchJob = [select Id,JobItemsProcessed,Status,NumberofErrors,TotalJobItems,CreatedBy.Email from AsyncApexJob where Id = :bc.getJobId()];
       string[] toAddresses = new string[]{batchJob.CreatedBy.Email};
        email.setToAddresses(toAddresses);
        email.setSubject(String.valueOf(this) + 'Batch Job Status Update');
        string emailBody = 'AsynApex Job '+batchJob.Id+' was completed with status : '+batchJob.Status+'.It consists of total :'+batchJob.TotalJobItems+' batch jobs, Total Error occured :'+batchJob.NumberofErrors;
        email.setPlainTextbody(emailBody);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});


    }
}