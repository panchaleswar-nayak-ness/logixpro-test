export interface ITransactionModelIndex {
  viewToShow: number;
  location: string;
  itemNumber: string;
  holds: boolean;
  orderStatusOrder: string;
  app: string;
  username: string;
  wsid: string;
}
export interface ICarouselZone {
  carousel: string;
  zone: string;
  locationName: string;
  totalLines: string;
  open: string;
  completed: string;
}
export interface IConnectionString {
    connectionName: string;
    serverName: string;
    databaseName: string;
    isButtonDisable:boolean;
    isSqlButtonDisable:boolean;
    isNewConn:boolean;
    isDuplicate:boolean;
  }
  