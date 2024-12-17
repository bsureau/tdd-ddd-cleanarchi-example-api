import { MessageBus } from '@core-logic/shared/services/messageBus';

export class FakeMessageBus implements MessageBus {
    public messages: Array<any> = [];

    dispatch(message: any): void {
        this.messages.push(message);
    }
}
