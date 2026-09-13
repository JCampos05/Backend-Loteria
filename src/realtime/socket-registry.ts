export interface SocketConnectionInfo {
    roomId: string;
    playerId: string;
}

export class SocketRegistry {
    private readonly connections = new Map<string, SocketConnectionInfo>();

    attach(socketId: string, info: SocketConnectionInfo): void {
        this.connections.set(socketId, info);
    }

    get(socketId: string): SocketConnectionInfo | undefined {
        return this.connections.get(socketId);
    }

    detach(socketId: string): SocketConnectionInfo | undefined {
        const info = this.connections.get(socketId);
        this.connections.delete(socketId);
        return info;
    }
}
