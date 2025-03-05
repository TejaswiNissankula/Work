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
private class contactTriggerHandlerTest {

    @isTest
    static void bypassTriggerTest(){
        List<User> userList = TestDataFactory.createUsers(2, 'test', 'userA', 'testuserA@nomail.com', 'testuserA@nomail.com', 'System Administrator');
        insert userList;
        //insert custom setting 
        system.runAs(userList[0]){
            List<TestDataFactory.automationSettingWrapper> asWrapperList = new List<TestDataFactory.automationSettingWrapper>();
            TestDataFactory.automationSettingWrapper settingWrapper =  new TestDataFactory.automationSettingWrapper();
            settingWrapper.userId = userList[0].Id;
            settingWrapper.objectName ='Contact';
            settingWrapper.byPassTrigger = true;
            asWrapperList.add(settingWrapper);
            List<Automation_setting__c> automationSettingList = TestDataFactory.createAutomationSetting(asWrapperList);
            insert automationSettingList;
            //insert account
            Account acct =TestDataFactory.createAccount();
            insert acct;

            //insert contact
            List<Contact> conList = TestDataFactory.createContacts(1);
            for(contact con : conList){
                con.AccountId = acct.Id;
            }
            Test.startTest();
            insert conList;
            Test.stopTest();
            Account accRec = [SELECT Total_Contacts__c FROM Account WHERE Id = :acct.Id];
            System.Assert.areEqual(0, accRec.Total_Contacts__c);
        }
    }

    @isTest
    static void addContactTest() {
        // TO DO: implement unit test
          //insert account
        Account acct =TestDataFactory.createAccount();
        insert acct;
        List<Contact> conList = TestDataFactory.createContacts(2);
        for(contact con : conList){
            con.AccountId = acct.Id;
        }    
        
        Test.startTest();
       
        insert conList;
        Account accRec = [SELECT Total_Contacts__c FROM Account WHERE Id = :acct.Id];
        System.Assert.areEqual(2, accRec.Total_Contacts__c);
        Test.stopTest();
        conList[0].LastName = null;
        try{
            update  conList[0];//Exception scenario
        }catch(exception e){
            System.Assert.areEqual('System.DmlException', e.getTypeName());
        }
    }

    @isTest
    static void updateContactTest(){
        List<Account> acctList =TestDataFactory.createAccounts(2);
        insert acctList;
        List<Contact> conList = TestDataFactory.createContacts(2);
        for(contact con : conList){
            con.AccountId = acctList[0].Id;
        }
        insert conList;
        Test.startTest();
        conList[0].AccountId = acctList[1].Id;
        conList[1].AccountId = acctList[1].Id;
        update conList;
        set<Id> accIdSet = new Set<Id>{acctList[0].Id,acctList[1].Id};
        Test.stopTest();
        List<Account> accRecList = [SELECT Total_Contacts__c FROM Account WHERE Id IN :accIdSet];
        System.Assert.areEqual(0, accRecList[0].Total_Contacts__c);
        System.Assert.areEqual(2, accRecList[1].Total_Contacts__c);
    }

    @isTest
    static void deleteContactTest(){
        Account acct =TestDataFactory.createAccount();
        insert acct;
        List<Contact> conList = TestDataFactory.createContacts(2);
        for(contact con : conList){
            con.AccountId = acct.Id;
        }
        insert conList;
        Test.startTest();
        delete conList[0];
        Test.stopTest();
        Account accRec = [SELECT Total_Contacts__c FROM Account WHERE Id = :acct.Id];
        System.Assert.areEqual(1, accRec.Total_Contacts__c);
    }

    @isTest
    static void unDeleteContactTest(){
        Account acct =TestDataFactory.createAccount();
        insert acct;
        List<Contact> conList = TestDataFactory.createContacts(2);
        for(contact con : conList){
            con.AccountId = acct.Id;
        }
        insert conList;
        Id contactId = conList[0].Id;
        delete conList[0];
        Test.startTest();
        undelete conList[0];
        Test.stopTest();
        Account accRec = [SELECT Total_Contacts__c FROM Account WHERE Id = :acct.Id];
        System.Assert.areEqual(2, accRec.Total_Contacts__c);
    }
}