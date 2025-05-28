public with sharing class childRelationShipController {
    

    @AuraEnabled
    public static List<SObject> querySelectedChildData(string recordId,string parentRelationShipField,string childObj){
        try {
            string parentId = recordId;
            string query ='select Id,Name from '+ childObj +' where '+parentRelationShipField +'= :parentId';
            system.debug('query -->'+query);
            List<SObject> results = Database.query(query,AccessLevel.USER_MODE);
            system.debug('results -->'+results);
            return results;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}