public with sharing class CustomCaseController {
      
    @auraEnabled(cacheable=true)
    public static List<case> fetchSubOrdinateCases(){
        try{
            set<Id> subOrdUserSet = new set<Id>();
            if(!schema.sObjectType.case.isAccessible()){
                throw new CustomException('User Donot have access to case object');
            }
            //fetch current user subordinate userIds
            for(User subOrdinate : [select Id,Name from user where userRoleId IN (select Id from userRole where parentRoleId = :userInfo.getUserRoleId())]){
                subOrdUserSet.add(subOrdinate.Id);
            }
            //adding running user
            subOrdUserSet.add(userInfo.getUserId());
            //return the cases related to subordinates and running user
           return subOrdUserSet?.size()>0 ? [select Id,CaseNumber,Subject,Priority,Status,Owner.Name,Owner.LastName from case where OwnerId IN :subOrdUserSet WITH USER_MODE] : new List<Case>();
           
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
}