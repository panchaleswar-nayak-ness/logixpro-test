export const TransactionConstants = {
    defaultStartDate: '1973,10,7',
    defaultStartYear: 1973,
    TRANSACTION_HISTORY_TYPE: 'TransactionHistory',
    ITEM_NUMBER_FILTER_TEMPLATE: "[Item Number] = '{0}'",
    SHOW_ALL_FILTER: '1=1'
}

export const TransactionNotificationMessage = {
    TransactionQuantityMustBePositive: (transactionType: string) => `Transaction Quantity must be a positive integer for transaction type ${transactionType} `,
    TransactionQuantityMustBeGreaterThanZero: (transactionType: string) => `Transaction Quantity must be greater than zero for transaction type ${transactionType} `,
    SpecifiedItemNumberMustHaveAWarehouse: 'Specified Item Number must have a Warehouse',
    UnitOfMeasureDoesNotMatchInventoryMaster: 'Unit of Measure does not match Inventory Master. (Expecting)'
}