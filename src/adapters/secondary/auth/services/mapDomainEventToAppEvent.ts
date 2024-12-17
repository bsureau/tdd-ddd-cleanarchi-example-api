import { UserRegisteredEvent } from '@core-logic/auth/events/userRegisteredEvent';
import { DomainEvent } from '@core-logic/shared/events/domainEvent';

export type ApplicationEvent = {
    type: string;
    payload: any;
};

export function mapDomainEventToAppEvent(
    domainEvent: DomainEvent
): ApplicationEvent {
    if (domainEvent instanceof UserRegisteredEvent) {
        return {
            type: 'USER_REGISTERED',
            payload: {
                email: domainEvent.email,
            },
        };
    } else {
        throw new Error('Unsupported domain event');
    }
}
