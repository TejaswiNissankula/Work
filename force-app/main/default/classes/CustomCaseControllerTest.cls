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
private class CustomCaseControllerTest {

    @isTest
    static void myUnitTest() {
        // TO DO: implement unit test
        List<UserRole> parentURole = new List<UserRole>();
        parentURole.addAll(TestDataFactory.createUserRoles('ParentUser','',1));
        insert parentURole;
        List<UserRole> childURole = new List<UserRole>();
        childURole.addAll(TestDataFactory.createUserRoles('childUser',parentURole[0].Name,2));
        insert childURole;

        List<User> userList = new List<User>();
        User u1 =  TestDataFactory.createUsers(1,'Atest','userA','testuserA@nomail.com','testuserA@nomail.com','System Administrator')[0];
        u1.userRoleId = parentURole[0].Id;
        //u1.Alias =testA;
        userList.add(u1);
         User u2 =  TestDataFactory.createUsers(1,'Btest','userB','testuserB@nomail.com','testuserB@nomail.com','Custom: Sales Profile')[0];
        u2.userRoleId = childURole[0].Id;
       // u2.Alias =testB;
        userList.add(u2);
        User u3 =  TestDataFactory.createUsers(1,'Ctest','userC','testuserC@nomail.com','testuserC@nomail.com','Custom: Sales Profile')[0];
        u3.userRoleId = childURole[1].Id;
       // u3.Alias =testB;
        userList.add(u3);
        system.debug('userList -->'+userList);
        insert userList;

        Test.startTest();
            System.runAs(u1){
                List<Case> caseList = new List<Case>();
                Case c1 = TestDataFactory.createCase('New','Phone','Laptop not Working','Medium');
                c1.OwnerId=userList[0].Id;
                caseList.add(c1);
                Case c2 = TestDataFactory.createCase('New','Email','Mouse not Working','Low');
                c2.OwnerId=userList[1].Id;
                caseList.add(c2);
                Case c3 = TestDataFactory.createCase('New','Web','Keyboard not Working','High');
                c3.OwnerId=userList[2].Id;
                caseList.add(c3);
                insert caseList;

              List<Case> finalCaseList=CustomCaseController.fetchSubOrdinateCases();
            system.assertEquals(3, finalCaseList.size());  
            }
            
        Test.stopTest();
        

    }
}