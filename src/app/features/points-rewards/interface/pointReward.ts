export interface PointsSearchQuery {
    FromDate?: string;
    ToDate?: string;
    UserGuid: string;
    PointType?: string;
    PageNo: number;
    PageSize: number;
  }
  
  export interface PointEvent {
    day: string;
    activity: string;
    pointEarned: string;
    total: string;
    totaL_POINT: string;
    p_Id: number;
    fromDate: null;
    toDate: null;
    userID: number;
    pointType: null;
    pageNo: number;
    pageSize: number;
  }
  
  export interface PointsApiResponse {
    event: {
      eventType: number;
      eventData: Array<{
        key: string;
        value: PointEvent[];
      }>;
      eventId: number;
    };
  }
  
  export interface GetPointsListResponse {
    Date: string;
    Activity: string;
    PointHistory: string;
    Total: string;
    TotalPoint: string;
  }