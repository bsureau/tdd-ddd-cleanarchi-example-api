import { IdGenerator } from '@core-logic/shared/services/idGenerator';

export class FakeIdGenerator implements IdGenerator {
    public fakeId: string = '16b9d629-6c99-4432-b885-377eb3f35261';

    uuid(): string {
        return this.fakeId;
    }
}
