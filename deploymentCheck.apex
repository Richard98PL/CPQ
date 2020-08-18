Set<String> cpqDeployableObjects = new Set<String>();

for(ObjectPermissions cpqObject : [SELECT SObjectType from ObjectPermissions WHERE Parent.NamespacePrefix IN ('SBQQ','SBAA')]){
    cpqDeployableObjects.add(cpqObject.SObjectType); 
}

cpqDeployableObjects.remove('SBQQ__InstallProcessorLog__c');
cpqDeployableObjects.remove('SBQQ__QuoteLine__c');
cpqDeployableObjects.remove('SBQQ__Quote__c');
cpqDeployableObjects.remove('SBQQ__RecordJob__c');

for(String cpqObject : cpqDeployableObjects){
    
    String query = 'SELECT Id, Name, CreatedDate FROM ' + cpqObject + ' WHERE CreatedDate >= LAST_N_DAYS:' + 15;
    List<SObject> tmpList = Database.query(query);
        
    if(tmpList.size() > 0){
        System.debug('Current object: ' + cpqObject +', listSize: ' + tmpList.size());
    }
  
}

