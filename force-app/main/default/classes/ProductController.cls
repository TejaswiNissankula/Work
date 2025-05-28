public with sharing class ProductController {
    
   @AuraEnabled(cacheable=true scope='global')
    public static List<Product__c> getProducts(FilterWrapper filters){
        try {
            List<Product__c> productsList = new List<Product__c>();
           List<String>  categoryList, materialList, levelList ,criteriasList = new List<String>{};
            decimal price;
            string selectQuery='select Id, Name, MSRP__c, Description__c, Category__c, Level__c, Picture_URL__c, Material__c from Product__c';
            string whereClause = '';
            //building where clause
            if(filters != null){
                system.debug('filters :: '+ filters);
                if(filters.searchKey!= null && String.isNotBlank(filters.searchKey)){
                    string key = '%'+string.escapeSingleQuotes(filters.searchKey)+'%';
                   // whereClause = 'Name like:key';
                    criteriasList.add('Name like :key');
                }
                if(filters.price != null ){
                   // whereClause = whereClause+' AND MSRP__c <=:filters.price';
                   price = filters.price;
                   system.debug('Price '+price);
                   system.debug('criteriasList:: Price before'+criteriasList);
                    criteriasList.add('MSRP__c <= :price');
                    system.debug('criteriasList:: price aafter'+criteriasList);
                }
                if( filters.category!= null  ){
                   // whereClause = whereClause+' AND Category__c in:filters.category';
                   system.debug('criteriasList :: '+criteriasList);
                   system.debug('categoryList :: '+categoryList);
                   categoryList = filters.category;
                    criteriasList.add('Category__c In :categoryList');
                }
                if(filters.material!= null ){
                    //whereClause = whereClause+' AND Material__c in:filters.material';
                    materialList = filters.material;
                    criteriasList.add('Material__c In :materialList');
                }
                if(filters.level!= null  ){
                   // whereClause = whereClause+' AND Level__c in:filters.level';
                    levelList = filters.level;
                    criteriasList.add('Level__c In :levelList');
                }
                if(criteriasList.size()>0){
                    whereClause = ' WHERE '+String.join(criteriasList,' AND ');
                    System.debug('criteriasList'+criteriasList);
                }
               // if(whereClause !=''){
                   // whereClause = ' WHERE '+whereClause;
                //}
                string userMode =' WITH USER_MODE';
                string query = selectQuery;
                system.debug('selectQuery '+selectQuery);
                system.debug('whereClause '+whereClause);
                system.debug('query '+query);
                //Query Builder
                if(whereClause != ''){
                    query = selectQuery + whereClause +userMode;
                }else{
                    query = selectQuery+userMode;
                }
                
                productsList = Database.query(query);
               
            }
            return productsList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class FilterWrapper{
       
        @AuraEnabled public string searchKey {get;set;}
        @AuraEnabled public Decimal price {get;set;}
        @AuraEnabled public List<string> category {get;set;}
        @AuraEnabled public List<string> material {get;set;}
        @AuraEnabled public List<string> level {get;set;}
      

    }

}