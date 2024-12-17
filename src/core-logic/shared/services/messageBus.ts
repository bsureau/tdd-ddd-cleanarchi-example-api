export interface MessageBus {
    dispatch<T>(message: T): void;
}
