import {RoomStatus} from '../enums/room-status';

export interface Room {
    id: string;
    code: string;
    status: RoomStatus;
    createdAt: Date;
    updatedAt: Date;
}