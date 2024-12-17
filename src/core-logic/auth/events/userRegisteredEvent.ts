import { DomainEvent } from '@core-logic/shared/events/domainEvent';

export class UserRegisteredEvent implements DomainEvent {
    public readonly occuredAt: Date;
    constructor(public readonly email: string) {
        this.occuredAt = new Date();
    }
}
