
export class UpdateQuantityRequest
{
     OTID :number
     Quantity :number
}

export class MarkoutCompleteTransactionRequest
{
    OTID :number
    ShipShort :boolean

}
export class MarkoutBlossomTotenRequest
{
    BlossomToteList :BlossomToteRecords[]
    NewTote :string
    IsBlossComp : boolean
  blosomtoterequest: BlossomToteRecords;

}

export class BlossomToteRecords{
    OTID: number
    QTY : number
}

export class ToteDataResponse
{
    data: ToteData[];
    consolZone: string;
    hospital: string;
    weightStatus: string;
    toteStatus: string;
    markoutStatus: string;
    blossomCount: number;
}

export class ToteData
{
    id: number;
    toteId: string;
    itemNumber: string;
    location: string;
    transQty: number;
    compQty: number;
    shortQty: number;
    status: string;
    orderNumber: string;
    completedDate: Date;
    oldToteQty: number | undefined;
}