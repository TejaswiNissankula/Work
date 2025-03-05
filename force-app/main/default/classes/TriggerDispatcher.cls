public with sharing class TriggerDispatcher {
    
    public static void run(ITriggerHandler handler,string objectName){

            if(handler.isDisabled()){
                return;
            }
            Automation_setting__c settings = Automation_setting__c.getInstance();
            if(settings.Id!= null && settings.Object_Name__c == objectName && settings.Bypass_Trigger__c){
                return;
            }
            switch on Trigger.operationType{
                when BEFORE_INSERT{
                    handler.beforeInsert(trigger.new);
                }
                when AFTER_INSERT{
                    handler.afterInsert(trigger.new,trigger.newMap);
                }
                when BEFORE_UPDATE{
                    handler.beforeUpdate(trigger.new,trigger.newMap,trigger.old,trigger.oldMap);
                }
                when AFTER_UPDATE{
                    handler.afterUpdate(trigger.new,trigger.newMap,trigger.old,trigger.oldMap);
                }
                when BEFORE_DELETE{
                    handler.beforeDelete(trigger.old, trigger.oldMap);
                }
                when AFTER_DELETE{
                    handler.afterDelete(trigger.old,trigger.oldMap);
                }
                when AFTER_UNDELETE{
                    handler.afterUndelete(trigger.new,trigger.newMap);
                }
            }


    }
}