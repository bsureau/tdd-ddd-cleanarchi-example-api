import { DateProvider } from '@core-logic/shared/services/dateProvider';

export class DeterministicDateProvider implements DateProvider {
    public fakeDate: Date = new Date();
    constructor() {}
    now() {
        return this.fakeDate;
    }
}
