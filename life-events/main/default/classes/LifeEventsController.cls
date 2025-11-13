public with sharing class LifeEventsController {
    
    /**
     * Retrieves life events associated with a contact
     * @param contactId The ID of the contact to retrieve life events for
     * @return List of LifeEvents__c records
     */
    @AuraEnabled(cacheable=true)
    public static List<LifeEvents__c> getLifeEventsByContact(Id contactId) {
        // Return early if contactId is null
        if (contactId == null) {
            return new List<LifeEvents__c>();
        }
        
        // Validate CRUD permissions before SOQL operation
        if (!Schema.sObjectType.LifeEvents__c.isAccessible()) {
            throw new AuraHandledException('Access denied: You do not have permission to access Life Events records.');
        }
        
        return [
            SELECT Id, EventType__c, EventDate__c, EventDescription__c, EventLocation__c
            FROM LifeEvents__c
            WHERE RelatedTo__c = :contactId
            ORDER BY EventDate__c ASC
        ];
    }
}
