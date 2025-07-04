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
            // reduce 1 level of array of strings to a single array of strings ex : [['a','b','c'],'d',['e','f']] turns to ['a', 'b', 'c', 'd', 'e', 'f']
            //we can also use flat() (and pass level as 1 or 2 or infinity based on that it flatten array) instead of reduce and concat
            //.reduce((prev,curr)=> prev.concat(curr),[])
            .flat(1)
            .filter((message)=> !! message);


}