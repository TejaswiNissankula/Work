public with sharing class OpportunityController {


    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunitesByStage(string stageName,string orderByField,string orderBy){
        try {
            if(!Schema.SobjectType.Opportunity.isAccessible()){
                throw new CustomException('Current user donot have Opportunity access');
            }
            string query ='select Id,Name,StageName,Amount,CloseDate from Opportunity';
            string whereCriteria;
            string orderClause;
            string sName = string.escapeSingleQuotes(stageName);
            string orderField = string.escapeSingleQuotes(orderByField);
            string order = string.escapeSingleQuotes(orderBy);
            //where clause setup
            if(string.isNotBlank(sName)){
                whereCriteria ='StageName = :sName';
            }else{
                whereCriteria ='StageName != :sName';
            }
            // orderfield  setup
            if(string.isNotBlank(orderField)){
                orderClause =' ORDER BY '+orderField ;
            }
            //order setup
            if(string.isNotBlank(order)){
                orderClause=orderClause+' '+order;
            }

            query = query + ' Where '+ whereCriteria + orderClause;
            system.debug('query- >'+query);
            return Database.query(query,AccessLevel.USER_MODE);
        }catch (Exception e) {
            system.debug('e.getMessage() --> '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }   
        
    }
   
}