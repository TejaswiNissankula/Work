public with sharing class CustomIterable implements Iterable<AggregateResult>{
   
    public Iterator<AggregateResult> iterator(){
        return new CustomIterator();
    }
}