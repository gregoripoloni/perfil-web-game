export type RoomId = string;

export interface Player {
  id: string;
  name: string;
}

export interface RoomPlayerStored {
  name: string;
  points: number;
  joinedAt: number;
}

export interface RoomPlayer extends Player {
  points: number;
  joinedAt: number;
}
