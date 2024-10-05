export interface PrivateCastData {
  protectedDataAddress: string;
  price: number;
  duration: number;
  // previewUrl: string;
}

export interface RerankedCast {
  item_id: string;
  score: number; // doesn't always show up in the response
  metadata: any; // post must be 24 hours old(?)
}
