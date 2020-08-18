Set<String> cpqDeployableObjects = new Set<String>();

for(ObjectPermissions cpqObject : [SELECT SObjectType from ObjectPermissions WHERE Parent.NamespacePrefix IN ('SBQQ','SBAA')]){
    cpqDeployableObjects.add(cpqObject.SObjectType); 
}

List<User> users = [SELECT ID,Name from User];
Map<Id,String> userNamesByIds = new Map<Id,String>();
for(User tmpUser : users){
    userNamesByIds.put(tmpUser.Id,tmpUser.Name);
}

cpqDeployableObjects.remove('SBQQ__InstallProcessorLog__c');
cpqDeployableObjects.remove('SBQQ__QuoteLine__c');
cpqDeployableObjects.remove('SBQQ__Quote__c');
cpqDeployableObjects.remove('SBQQ__RecordJob__c');

cpqDeployableObjects.add('Product2');
cpqDeployableObjects.add('PricebookEntry');

String debugString = '';
Integer i = 0;

for(String cpqObject : cpqDeployableObjects){
    
    String query = 'SELECT Id, ' + 
        			      'Name, ' +
        				  'CreatedDate, ' +
        				  'LastModifiedDate, ' +
        				  'LastModifiedById ' +
        		   'FROM ' + cpqObject + ' WHERE LastModifiedDate >= LAST_N_DAYS:' + 15 + ' ORDER BY LastModifiedDate DESC';
    
    List<SObject> tmpList = Database.query(query);
        
    if(tmpList.size() > 0){
        System.debug(cpqObject +', listSize: ' + tmpList.size());
			
        i = 1;
        for(SObject record : tmpList){
            debugString = '----> ';
            debugString += ('Name: ' + record.get('Name'));
            debugString += (', Id: ' + record.get('Id'));
            debugString += (', LastModifiedDate: ' + record.get('LastModifiedDate'));
            debugString += (', LastModifiedBy: ' + userNamesByIds.get((Id)record.get('LastModifiedById')));
            if(i == tmpList.size())  {
                debugString += '\n';
            }
            i++;
            System.debug(debugString);
        }

    }
    
}
