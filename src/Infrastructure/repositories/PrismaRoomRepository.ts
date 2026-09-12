import { PrismaClient, RoomStatus as PrismaRoomStatus } from "@prisma/client";
import { IRoomRepository } from "../../domain/repositories/IRoomRepository";
import { Room } from "../../domain/entities/room";
import { Player } from "../../domain/entities/player";

export class PrismaRoomRepository implements IRoomRepository {
    private readonly prisma = new PrismaClient(); //conexion con la base de datos, distanciando directamente a prisma

    async create(room: Room, HostPlayer: Player): Promise<{ room: Room; Host: Player }> {
        const [createdRoom, createdHost] = await this.prisma.$transaction([ // creacion de la sala, si hay alguna caida de internet del host este cancelara todo el poceso de creacion
            this.prisma.room.create({
                data: {                                       // Informacion que se guarda dentro de la BD de la sala
                    id: room.id,
                    code: room.code,
                    status: room.status as PrismaRoomStatus,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt
                },
            }),
            this.prisma.player.create({                      // esta es la info que guarda la BD del host, que es el primer jugador que se une a la sala
                data: {
                    id: HostPlayer.id,
                    name: HostPlayer.name,
                    roomId: room.id,
                    isHost: HostPlayer.isHost,
                    connected: HostPlayer.connected,
                    socketId: HostPlayer.socketId,
                    joinedAt: HostPlayer.joinedAt
                },
            }),
        ]);

        return {                                               // se retorna la sala y el host que se creo en la BD
            room: createdRoom as Room as unknown as Room,
            Host: createdHost as Player as unknown as Player,
        };
    }

    async findByCode(code: string): Promise<Room | null> {      //se busca la sala por el codigo que se le pasa como parametro, si no existe retorna null
        const prismaRoom = await this.prisma.room.findUnique({
            where: { code },
        });
        return prismaRoom as Room | null;
    }

    async findById(id: string): Promise<Room | null> {          //se busca la sala por el id
        const prismaRoom = await this.prisma.room.findUnique({
            where: { id },
        });
        return prismaRoom as Room | null;
    }

    async existsByCode(code: string): Promise<boolean> {   // se usa para verificar si el codigo ya esya en uso
        const count = await this.prisma.room.count({
            where: { code },
        });
        return count > 0;
    }

    async updateStatus(roomId: Room, status: PrismaRoomStatus): Promise<Room> {  // cambia el status de la partida en la base de datos
        const updatedRoom = await this.prisma.room.update({
            where: { id: roomId.id },
            data: { status },
        });
        return updatedRoom as unknown as Room;
    }

    async addPlayer(player: Player): Promise<Player> { // agrega un nuevo jugador a la sala
        const newPlayer = await this.prisma.player.create({
            data: {                            // agrega los datos del jugador a la base de datos
                id: player.id,
                name: player.name,
                roomId: player.roomId,
                isHost: player.isHost,
                connected: player.connected,
                socketId: player.socketId,
                joinedAt: player.joinedAt
            },
        });
        return newPlayer as unknown as Player;   //retorna el jugador que se agrego a la base de datos
    }

    async findPlayerById(id: string): Promise<Player | null> {       // busca un jugador por su id, si no lo encuentra retorna null
        const prismaPlayer = await this.prisma.player.findUnique({ //crea una instancia de prisma para buscar el jugador en la base de datos
            where: {id}, //lo busca mediante su id, que es unico para cada jugador
        });
        return prismaPlayer as Player | null; //retorna el jugador que se encontro en la base de datos
    }

    async getPlayersByRoomId(roomId: Room): Promise<Player[]> { // devuelve un array con todos los jugadores que estan en la sala, ordenados por fecha de ingreso
        const prismaPlayer = await this.prisma.player.findMany({
            where: { roomId: roomId.id }, // busca a los jugadores que estan en la sala mediante el id de la sala
            orderBy: { joinedAt: 'asc'}, // los ordena de manera ascendente por la fecha
        });
        return prismaPlayer as unknown as Player[];
    }

    async removePlaye(playerId: string): Promise<void> { // elimina un jugador de la sala mediante su id, no retorna nada
        await this.prisma.player.delete({ //es la instancia de prima para eliminarlo
            where: { id: playerId }, // lo busca con el id del jugador
        });
    }

    async deleteIfEmpty(roomId: string): Promise<boolean> {  // checa si la sala esta vacia, si lo es elimina esta sala de la bd
        const Playercount = await this.prisma.player.count({
            where: { roomId },
        });
        if (Playercount === 0) {            // si el contador de jugadores es 0, la elimina
            await this.prisma.room.delete({ //instancia de prisma para eliminar la sala
                where: { id: roomId },       //aqui se busca la sala con su id
            });
            return true;
        }
        return false;
    }
}
