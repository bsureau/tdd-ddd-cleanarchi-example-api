export default class EmailAddressAlreadyInUseError extends Error {
    constructor(m: string) {
        super(m);
    }
}
