trigger BatchApexErrorEventTrigger on BatchApexErrorEvent (after insert) {
    //TriggerDispatcher.run(new BatchApexErrorEventTriggerHandler(),'BatchApexErrorEvent');
    if(trigger.isAfter && trigger.isInsert){
        BatchApexErrorEventTriggerHandler.afterInsert(trigger.new);
    }

}