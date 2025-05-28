public with sharing class FetchExpectionLogs {
    
    @AuraEnabled
    public static List<Exception_Log__c> fetchException(){
        List<Exception_Log__c> excLog = new List<Exception_Log__c>();
        Integer displayRecs = 20;
        Integer position = 0;
        Integer recsToFetch ;
        Integer remainingRecs ;

        try {
            string qString ='select Id,Name,Owner.Username from Exception_Log__c with USER_MODE';
            Database.Cursor c ;
            //Cache.Session : To use this feature , we need to go to setup --> search with  "platform Cache" --> create a new platform cache partition , mark it as default,allocate 'provider free' capacity to 1 under Session Cache Allocation. 
            if(Cache.Session.contains('exceptionCursor')){
                c = (Database.Cursor)Cache.Session.get('exceptionCursor');
                position =  (Integer)Cache.Session.get('exceptionCursorCurrPosi');
                system.debug('Existing cursor from cache-->'+c);
                system.debug('Existing cursor position from cache-->'+position);
            }else{
                List<Apex_Cursor__c> apexCur = [select Cursor__c,Object_Name__c from Apex_Cursor__c where Query_string__c=: qString AND CreatedDate = LAST_N_DAYS:2];
                if(apexCur != null && apexCur.size()>0){
                    c = (Database.Cursor)JSON.deserialize(apexCur[0].Cursor__c, Database.Cursor.class);
                }
                system.debug('Existing cursor from stored rec-->'+c);
            }
            system.debug('cursor-->'+c);
            if(c == null){
                c = Database.getCursor(qString);
                Apex_Cursor__c ac = new Apex_Cursor__c();
                ac.Cursor__c=JSON.serialize(c);
                ac.Query_string__c = qString;
                insert ac;
                system.debug('new cursor -->'+c);
                system.debug('new cursor JSON Serialize -->'+JSON.serialize(c));
            }
            System.debug('position-->'+position);
            System.debug('c.getNumRecords()-->'+c.getNumRecords());
            remainingRecs =  c.getNumRecords()- position;
            System.debug('remainingRecs-->'+remainingRecs);
            if(remainingRecs > 0){
            recsToFetch = remainingRecs > displayRecs ? displayRecs : remainingRecs;
            excLog = c.fetch(position,recsToFetch);
            position = position + recsToFetch;
            Cache.Session.put('exceptionCursor', c);
            Cache.Session.put('exceptionCursorCurrPosi',position);
            system.debug('excLog--->'+excLog);
            system.debug('Cache.Session.exceptionCursor--->'+Cache.Session.get('exceptionCursor'));
            system.debug('Cache.Session.CursorPosition--->'+Cache.Session.get('exceptionCursorCurrPosi'));
            }else{
                system.debug('no more records to fetch');
                
            }
            return excLog;
        } catch (Exception e) {
            system.debug('exception-->'+e);
            //return null;
            throw new AuraHandledException('Something Went wrong: '+e.getMessage());
        }
    }
    
        
}