/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class TestDataFactory {

    public static List<UserRole> createUserRoles(string Name,string parentRoleName,integer count){

        List<UserRole> uRoleList = new List<UserRole>();
        Id roleId = string.isNotBlank(parentRoleName)? getRoleId(parentRoleName) : null;
        for(integer i=0;i<count;i++){
            UserRole u =new UserRole(Name=Name+i);
            u.ParentRoleId = roleId;
            uRoleList.add(u);
        }
        return uRoleList;
    }
   /* public static Map<string,Id> getUserRoleIdMap(List<string> roleDevNameList){
        
        if(roleDevNameList != null && !roleDevNameList.isEmpty()){
            Map<string,Id> userRoleDevNameIdMap = new Map<string,Id>();
            for(useRole rec : [select Id,DeveloperName from UserRole where DeveloperName IN :roleDevNameList]){
                userRoleDevNameIdMap.add(rec.DeveloperName,rec.Id);
            }
            return userRoleDevNameIdMap;
        }   
    }*/
    public static Id getRoleId(string roleName){
        return [select Id from UserRole where Name = :roleName]?.Id;
    }
   
    public static List<User> createUsers(Integer numUsers,string fName,string lName,string email,string userName, String profileName){
        List<User> users = new List<User>();
        for (Integer i = 0;i<numUsers;i++){
            User usr = new User();
            usr.FirstName = fName ?? 'Test'; //Null Coalescing Operator : if left operand is null it will assign right operand value.
            usr.LastName = lName ?? 'User'+i;
            usr.Email = i + (email ?? 'test.user@nomail.com');
            usr.EmailEncodingKey = 'UTF-8';
            usr.Alias = 'test'+i;
            usr.UserName = i+ (userName ?? 'test.user@nomail.com');
            usr.ProfileId = getProfileId(profileName);
            usr.TimeZoneSidKey = 'America/Los_Angeles';
            usr.LocaleSidKey = 'en_US';
            usr.LanguageLocaleKey = 'en_US';
            usr.IsActive = true;
            users.add(usr);
        }
        return users;
    }
    public static Id getProfileId(String profileName){
        return [SELECT Id FROM Profile WHERE Name = :profileName LIMIT 1]?.Id;
    }
       
    public static List<Automation_setting__c> createAutomationSetting(List<automationSettingWrapper> wrapList){
        List<Automation_setting__c> autoSettingList = new List<Automation_setting__c>();
        if(wrapList.size()>0){
            for(Integer i=0;i< wrapList.size();i++){
                Automation_setting__c automationSetting = new Automation_setting__c();
                automationSetting.SetupOwnerId = wrapList[i].userId ?? wrapList[i].profileName;
                automationSetting.Object_Name__c = wrapList[i].objectName;
                automationSetting.Bypass_Trigger__c = wrapList[i].byPassTrigger ?? false ;
                automationSetting.Bypass_Validation_Rules__c = wrapList[i].byPassValidationRule ?? false;
                automationSetting.Bypass_Process_Builders__c = wrapList[i].byPassProcessBuilder ?? false;
                automationSetting.Bypass_Workflow_Rules__c = wrapList[i].byPassWorkflowRule ?? false;
                automationSetting.Bypass_Flows__c = wrapList[i].byPassFlow ?? false;
                autoSettingList.add(automationSetting);
            }
        }
        return autoSettingList;
    }
    public class automationSettingWrapper{
       public  Id userId {get;set;}
       public string profileName {get;set;}
       public string objectName  {get;set;}
       public Boolean byPassTrigger {get;set;}
       public Boolean byPassFlow {get;set;}
       public Boolean byPassProcessBuilder {get;set;}
       public Boolean byPassWorkflowRule {get;set;}
       public Boolean byPassValidationRule {get;set;}
    }
    public static Account createAccount() 
    {
        Account act = new Account();
        act.Name = 'Account'+1;
        return act;
    }
    
    public static List<Account> createAccounts(Integer numAccounts) 
    {
        List<Account> accountList = new List<Account>();
            for(Integer i=0; i<numAccounts;i++){
                Account act = new Account();
                act.Name = 'Account'+i;
                accountList.add(act);
            }
        return accountList;
    }
    public static contact createContact() 
    {
        contact cont = new contact();
        cont.FirstName = 'Test';
        cont.LastName = 'Contact'+1;
        cont.Email = 'test.contact'+1+'@nomail.com';
        return cont;
    }
    public static List<contact> createContacts(Integer numConts){
        List<contact> contList = new List<contact>();
        for(integer i=0; i<numConts;i++){
            contact cont = new contact();
            cont.FirstName = 'Test';
            cont.LastName = 'Contact'+i;
            cont.Email = 'test.contact'+i+'@nomail.com';
            contList.add(cont);
        }
        return contList;
    }

    public static Case createCase(string status,string origin,string subject,string priority){
        Case caseRec = new Case();
        caseRec.Status =status;
        caseRec.Subject = subject;
        caseRec.Priority = priority;
        caseRec.Origin = origin;
        return caseRec;
    }
    
}