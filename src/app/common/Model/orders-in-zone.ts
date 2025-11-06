export interface OrdersInZoneRequest {
  OrderView?: string;
}

export interface OrdersInZoneResponse {
  orderNumber?: string;
  requiredDate?: string;
  totalLine: number;
  priority?: number;
}

export interface OrdersInZoneApiResponse {
  status: number;
  message: string;
  value: OrdersInZoneResponse[];
  errors: string[];
  isSuccess: boolean;
}

