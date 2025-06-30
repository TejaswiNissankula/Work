public with sharing class ObjectMetadataExplorer {
    public static void exploreSObject(string objName){

        //obj describe
        Map<String ,Schema.SObjectType> sobjMap = schema.getGlobalDescribe();
        Schema.DescribeSObjectResult sObj = sobjMap.get(objName).getDescribe();

        // obj level access :
        system.debug('Obj label'+sObj.getLabel());
        system.debug('is obj accessible --> '+sObj.isAccessible());
        system.debug('is obj creatable --> '+sObj.isCreateable());
        system.debug('is obj updatable --> '+sObj.isUpdateable());
        system.debug('is obj deletable --> '+sObj.isDeletable());
        system.debug('is obj deletable --> '+sObj.isUndeletable());

        // fields Map

        Map<String,Schema.SObjectField> fieldsMap =sObj.Fields.getMap();

        for(string field : fieldsMap.keySet()){
            // describe field result
            Schema.DescribeFieldResult fieldDes = fieldsMap.get(field).getDescribe();
            
            // field type and field level access 
            system.debug('field label'+fieldDes.getLabel());
            system.debug('field Type'+fieldDes.getType());
            system.debug('is field accessible'+ fieldDes.isAccessible());
            system.debug('is field creatable'+fieldDes.isCreateable());
            system.debug('is field updateable'+fieldDes.isUpdateable());
           
            if(fieldDes.getType() == Schema.DisplayType.Picklist){
                // get picklist vlaues of field
                List<Schema.PicklistEntry> picklistValues= fieldDes.getPicklistValues();
                for(Schema.PicklistEntry entry : picklistValues){
                    system.debug('picklist label --> '+entry.getLabel());
                    System.debug('picklist value --> '+entry.getValue());
                    System.debug('picklist isActive --> '+entry.isActive());
                    System.debug('picklist default value --> '+entry.isDefaultValue());
                }
            }

        }

        // getChildRelationships

        List<Schema.ChildRelationship> childRelations = sObj.getChildRelationShips();
        for(Schema.ChildRelationship child : childRelations){
            system.debug('Child Obj Name --> '+ child.getChildSObject());
            system.debug('Relationship Name --> '+ child.getRelationshipName());
            system.debug('Field  Name --> '+ child.getField());
        }

        // getRecordtypeInfo

        Map<String, Schema.RecordTypeInfo> recordTypeInfos = sObj.getRecordTypeInfosByDeveloperName();
        for(string recordDevname : recordTypeInfos.keySet()){
            system.debug('RecordType Developer Name'+ recordDevname);
            system.debug('RecordType Id'+ recordTypeInfos.get(recordDevname).getRecordTypeId());
            system.debug('RecordType Id'+ recordTypeInfos.get(recordDevname).getName());
        }

    }
}