export interface BoardCard {
    id: string;
    playerBoardId: string;
    cardId: number;
    position: number;
    marked: boolean;
}