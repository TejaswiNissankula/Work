trigger contactTrigger on Contact (before insert,before update,before delete,after insert,after update,after delete,after undelete) {
    
        TriggerDispatcher.run(new contactTriggerHandler(),'Contact');
    
}