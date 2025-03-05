public with sharing class exceptionHandlerUtility {
    
    public static void logException(Exception ex,string className,string methodName){
        string exDetails;
        if(ex.getTypeName()== 'DmlException'){
           for(integer i=0; i<ex.getNumDml(); i++){
                List<String> dmlFields = ex.getDmlFieldNames(i);
                exDetails = exDetails+'Index:'+i+' '+' Id:'+ex.getDmlId(i)+' '+' Msg '+ex.getDmlMessage(i)+' '+' dmlFields:'+string.join(dmlFields,',');
            }
            exDetails = exDetails+' ; '+ex.getStackTraceString();
        }else{
           exdetails = ex.getCause()+' ; '+ex.getLineNumber() + ' ; '+ex.getMessage()+' ; '+ex.getStackTraceString();
        }
        Exception_Log__c logEx = new Exception_Log__c();
        logEx.Type_Name__c = ex.getTypeName();
        logEx.Details__c = exDetails;
        logEx.Class_Name__c = className;
        logEx.Method_Name__c = methodName;
        insert logEx;
    }
    
}