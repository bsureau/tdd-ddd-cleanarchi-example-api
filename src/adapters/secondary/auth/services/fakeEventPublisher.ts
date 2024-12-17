import { DomainEvent } from '@core-logic/shared/events/domainEvent';
import { DomainEventPublisher } from '@core-logic/shared/services/domainEventPublisher';
import {
    ApplicationEvent,
    mapDomainEventToAppEvent,
} from './mapDomainEventToAppEvent';

export class FakeEventPublisher implements DomainEventPublisher {
    public events: ApplicationEvent[] = [];

    publishAll(events: DomainEvent[]): void {
        const appEvents = events.map(event => mapDomainEventToAppEvent(event));
        this.events = appEvents;
    }
}
