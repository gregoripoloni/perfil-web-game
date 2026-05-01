export type RoomId = string;

export interface Player {
  id: string;
  name: string;
}

export interface MultiplayerPlayer extends Player {
  points: number;
  timestamp: number;
}
