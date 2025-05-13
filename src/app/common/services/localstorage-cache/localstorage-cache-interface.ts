export interface ILocalStorageCache<T> {
    init(storageKey: string): void;
    getData(): T;
    setData(data: T): void;
    clearData(): void;
}