import { Logger } from '@core-logic/shared/services/logger';

export class FakeLogger implements Logger {
    public messages: Array<string> = [];

    info(message: string): void {
        this.messages.push(message);
    }
    error(message: string): void {
        this.messages.push(message);
    }
}
