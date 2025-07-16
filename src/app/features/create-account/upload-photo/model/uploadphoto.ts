
export interface UploadPhoto {
    imageFile: File | null;
    deviceType: string;
    formValue?: string | null;
    //hImageName?: string | null;
    //hID?: string | null;
    Url?: string | null;
    //hFolderId?: string | null;
    //folderName?: string | null;
    isFromBlueCollare?: boolean | null;
    imageWidth?: number | null;
    imageHeight?: number | null;
    imageXAxis?: number | null;
    imageYAxis?: number | null;
    version?: string | null;
    UserGuidId: string | null;
    decodeId?: string | null;
  }
  