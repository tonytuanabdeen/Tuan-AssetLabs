import { LightningElement, api, wire, track } from 'lwc';
import getLifeEventsByContact from '@salesforce/apex/LifeEventsController.getLifeEventsByContact';

const ICON_BY_EVENT_TYPE = {    
    Birth: 'utility:identity',    
    Graduation: 'utility:education',    
    Job: 'utility:listen',
    Marriage: 'utility:announcement',    
    Retirement: 'utility:clock'    
};

export default class LifeEventMiestoneDisplay extends LightningElement {
    @api recordId;
    @track lifeEvents = [];

    error;
    isLoading = true;

    @wire(getLifeEventsByContact, { contactId: '$recordId' })
    wiredLifeEvents({ data, error }) {
        if (data) {
            this.lifeEvents = data.map((record) => this.transformLifeEvent(record));
            this.error = undefined;
        } else if (error) {
            this.error = this.reduceError(error);
            this.lifeEvents = [];
        }

        this.isLoading = false;
    }

    get hasLifeEvents() {
        return this.lifeEvents && this.lifeEvents.length > 0;
    }

    get isEmptyState() {
        return !this.isLoading && !this.hasLifeEvents && !this.error;
    }

    transformLifeEvent(record) {
        const eventType = record.EventType__c;
        const formattedDate = record.EventDate__c
            ? new Intl.DateTimeFormat(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
              }).format(new Date(record.EventDate__c))
            : 'Date not available';

        return {
            id: record.Id,
            type: eventType || 'Life Event',
            iconName: this.resolveIconName(eventType),
            formattedDate,
            description: record.EventDescription__c,
            location: record.EventLocation__c
        };
    }

    resolveIconName(eventType) {        
        if (!eventType) {
            return 'utility:event';
        }

        const normalizedType = eventType.trim();

        return ICON_BY_EVENT_TYPE[normalizedType] || 'utility:event';
    }

    reduceError(error) {
        if (Array.isArray(error?.body)) {
            return error.body.map((e) => e.message).join(', ');
        }

        return error?.body?.message || error?.message || 'An unexpected error occurred while retrieving life events.';
    }
}

