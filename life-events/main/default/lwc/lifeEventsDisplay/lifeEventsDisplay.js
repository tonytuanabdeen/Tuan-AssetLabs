import { LightningElement, api, wire } from 'lwc';
import getLifeEventsByContact from '@salesforce/apex/LifeEventsController.getLifeEventsByContact';

export default class LifeEventsDisplay extends LightningElement {
    @api recordId;
    lifeEvents = [];
    error;

    @wire(getLifeEventsByContact, { contactId: '$recordId' })
    wiredLifeEvents({ error, data }) {
        if (data) {
            // Process the data to prepare for display
            this.lifeEvents = data.map(event => ({
                id: event.Id,
                eventType: event.EventType__c,
                eventDate: event.EventDate__c,
                eventDescription: event.EventDescription__c,
                eventLocation: event.EventLocation__c,
                iconName: this.getIconName(event.EventType__c)
            })).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.lifeEvents = [];
        }
    }

    getIconName(eventType) {
        switch(eventType) {
            case 'Birth':
                return 'utility:identity';
            case 'Graduation':
                return 'utility:education';
            case 'Job':
                return 'utility:listen';
            case 'Marriage':
                return 'utility:announcement'; 
            case 'Retirement':
                return 'utility:clock';
            default:
                return 'utility:event'
        }
    }
}
