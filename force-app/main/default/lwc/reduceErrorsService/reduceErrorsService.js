/* 
@parameters : takes array[] of errors
@return : string[]
*/

export function reduceErrorsFunction(errors){

    if(!Array.isArray(errors)){
        errors = [errors];
    }
    return errors
            //remove falsy values like null,undefined,0
            .filter((value) => !!value)
            //extract the error message from each error
            .map((error)=>
            {
                //UI API read errors
                if(Array.isArray(error.body)){
                    return error.body.map((e)=> e.message);
                }
                //UI API DML,Apex and network errors
                else if(error.body && typeof error.body.message === 'string'){
                    return error.body.message;
                }
                // JS errors
                else if(typeof error.message === 'string'){
                    return error.message;
                }
                //Unknow error shape so try HTTP Status text
                return error.statusText;
            })
            // reduce array of strings to a single string 
            .reduce((prev,curr)=> prev.concat(curr),[])
            .filter((message)=> !! message);


}