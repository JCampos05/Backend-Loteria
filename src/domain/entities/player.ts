export interface Player {
    id: string;
    roomId: string;
    name: string;
    isHost: boolean;
    connected: boolean;
    socketId: string | null;
    joinedAt: Date;
}