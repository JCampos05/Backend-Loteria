export interface WinClaim {
    id: string;
    gameId: string;
    playerId: string;
    isValid: boolean;
    reason: string | null;
    claimedAt: Date;
}