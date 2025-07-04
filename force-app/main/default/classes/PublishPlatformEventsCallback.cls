public with sharing class PublishPlatformEventsCallback implements EventBus.EventPublishFailureCallback,EventBus.EventPublishSucsessCallback{
    public void onSuccess(EventBus.SuccessResult sResult){
        List<string> eventUuId =  sResult.getEventUuids();
        
    }
    public void onFailure(EventBus.FailureResult fResult){

    }
}