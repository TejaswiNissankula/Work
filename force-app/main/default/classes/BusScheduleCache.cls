public with sharing class BusScheduleCache {
    private Cache.OrgPartition part;
    public BusScheduleCache() {
        part = Cache.Org.getPartition('local.BusSchedule');
    }
    public void putSchedule(String busLine, Time[] schedule){
        part.put(busLine,schedule);
    }
    public Time[] getSchedule(String busLine){
       Time[] scheduleResult = (Time[])part.get(busLine);
       if(scheduleResult == null){
        Time tObj1 = Time.newInstance(8, 0, 0, 0);
        Time tObj2 = Time.newInstance(17, 0, 0, 0);
        return new Time[]{tObj1,tObj2};
       }
        return scheduleResult;
    }
}