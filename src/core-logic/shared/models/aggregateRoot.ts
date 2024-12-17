import { DomainEvent } from '../events/domainEvent';

export abstract class AggregateRoot {
    private domainEvents: DomainEvent[] = [];

    public addDomainEvent(domainEvent: DomainEvent): void {
        this.domainEvents.push(domainEvent);
    }

    public getDomainEvents(): DomainEvent[] {
        return this.domainEvents;
    }
}
