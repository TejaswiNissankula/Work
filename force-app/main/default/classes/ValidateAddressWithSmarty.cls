public with sharing class ValidateAddressWithSmarty {
 //created this named credentials in org : creative-moose-m58t2q.com (Field Service Lightning).
 //we will find named cred reference in org : resilient-panda-a5t3u4.com but ,while creating principle for admin AuthId and AuthToken it is throwing error.Hence check creative moose org for valid Named Creds.
 // this method will make an http callout to us street validation service ,which validates the provided address and sends the resposne back
// to maintain consistency across all type of responses i used a wrapper class to hold the details
// external system required auth details to be sent in url hence the auth details are urlencoded while sending.Ideally if external system 
//supports to send those details in header of request then we no need to hardcode here.We just need to maintain at external credentials priniciple level and mention custom header
// to dynamically drive the request while using its related Named credentials 
 public static AddressValidationWrapper validateAddress(){
        AddressValidationWrapper wrap = new AddressValidationWrapper();
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            string city ='Redmond';
            string state ='WA';
            string street='17781 NE 90TH ST';
            String authId = '?auth-id=' +EncodingUtil.urlEncode('4bf32b4b-ba32-78f1-ecf1-7638e8f82e35', 'UTF-8');
            String authToken ='&auth-token='+ EncodingUtil.urlEncode('UNQ8LDXLaLFxXushNUAX', 'UTF-8');
            
            string streetPar ='&street='+EncodingUtil.urlEncode(street, 'UTF-8');
            string cityPar = '&city='+EncodingUtil.urlEncode(city, 'UTF-8');
            string statePar = '&state='+EncodingUtil.urlEncode(state, 'UTF-8');
    
            string endpoint = 'callout:Smarty_Address_Validation'+authId
            +authToken+streetPar+cityPar+statePar;
            // Postman url to check the response :
            // https://us-street.api.smarty.com/street-address?auth-id=4bf32b4b-ba32-78f1-ecf1-7638e8f82e35&auth-token=UNQ8LDXLaLFxXushNUAX&street=17781+NE+90TH+ST&city=Redmond&state=WA
            // auth id and auth token i taken from my smarty account
            req.setEndpoint(endpoint);
            req.setMethod('GET');

            //Integer maxRetry = 3;
            //while(maxRetry>0){
                try{
                    HttpResponse res = http.send(req);
                    List<Object> result = (List<Object>)JSON.deserializeUntyped(res.getBody());
                    if(res.getStatusCode() == 200){
                        Map<String,Object> resultMap= (Map<String,Object>) result[0];
                        Object recResult = (Object)resultMap.get('components');
                        system.debug('request successful -->'+ recResult);
                        //maxRetry = 0;
                        wrap.isValid = true;
                        wrap.rawResponse =(string)JSON.serialize(result) ;
                    }else{
                        system.debug('request failed -->'+ res.getBody());
                        wrap.isValid = false;
                        wrap.errorMessage ='Status : '+res.getStatus()+'Status Code :'+ res.getStatusCode()+' Body:: '+res.getBody();
                        //maxRetry--;
                    }
                }catch(Exception error){
                    wrap.isValid = false;
                    wrap.errorMessage =exceptionHandlerUtility.parseException(error);
                }
                return wrap;
           // }
    }

    public class AddressValidationWrapper{
        public boolean isValid;
        public string rawResponse;
        public string errorMessage;
    }

   
}
