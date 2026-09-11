import { RoomStatus } from "@prisma/client";
import { Player } from "../entities/player";
import { Room } from "../entities/room";

// Requisito funcional "RF-01" Adrian Montes

export interface IRoomRepository {
  //metodos para las salas
  create(room: Room, HostPlayer: Player): Promise<{ room: Room, Host: Player, }> // este metodo lo van a implementar despues en los repositorios de prisma donde usaran esta inerfaz
  findByCode(code: string): Promise<Room | null> // busqueda de sala por codigo, string por que se generara aleatoriamente ej. BCS-PN1C
  findById(id: string): Promise<Room | null>; // mandas en id y te devuelve la sala existente con ese id o nulo si no lo encuentra
  existsByCode(code: string): Promise<Boolean>; // si encuentra la sala delvuelve un booleano
  updateStatus(roomId: Room, status: RoomStatus): Promise<Room> // actualiza el estado de la sala por el id que se proporciona

  // metodos para los jugadores
  addPlayer(player: Player): Promise<Player>; // metodo para agregar jugador a la sala
  findPlayerById(id: string): Promise<Player | null>; // si no enccuentra jugador devuelve nulo
  getPlayersByRoomId(roomId: Room): Promise<Player[]>; // devuelve la lista de jugadores en un array dependiendo de la id de la sala
  removePlaye(playerId: string): Promise<void>; // se manda el id del jugador que se va a eliminar y no devuelve nada

  // borrar salas vacias
  deleteIfEmpty(roomId: string): Promise<boolean> // si es true se borra la sala por que esta vacia
}
