public with sharing class MyIterable  implements Iterable<String>{

   private List<String> strings;
   public MyIterable(List<String> strings) {  
      this.strings = strings;
   }
   
    public Iterator<String> Iterator(){
      return strings.iterator();
   }
}