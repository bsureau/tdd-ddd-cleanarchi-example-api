import { DomainEvent } from '../events/domainEvent';

export interface DomainEventPublisher {
    publishAll(events: DomainEvent[]): void;
}
