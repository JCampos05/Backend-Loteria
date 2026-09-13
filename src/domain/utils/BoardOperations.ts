import { Card } from '../entities/card';
import { BoardCard } from '../entities/board-card';
import * as crypto from 'crypto';

export class BoardOperations {
    /**
     * Genera las 16 cartas de una tabla de lotería sin repetición.
     * Implementa Fisher-Yates shuffle para garantizar aleatoriedad y cero repetición.
     * 
     * @param deck Mazo de cartas disponibles (usualmente 54).
     * @param playerBoardId ID de la tabla a la que pertenecerán estas cartas.
     * @returns Array de 16 objetos BoardCard que cumplen la interfaz original.
     */
    public static generateRandomBoard(deck: Card[], playerBoardId: string): BoardCard[] {
        if (deck.length < 16) {
            throw new Error("El mazo debe tener al menos 16 cartas para generar una tabla.");
        }

        // Clonamos el mazo para evitar mutar el array original (buenas prácticas funcionales)
        const shuffled = [...deck];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Seleccionamos las primeras 16 cartas, ya mezcladas y sin repetición
        const selectedCards = shuffled.slice(0, 16);

        // Devolvemos el array respetando estrictamente la interfaz BoardCard existente
        return selectedCards.map((card, index) => ({
            id: crypto.randomUUID(),
            playerBoardId: playerBoardId,
            cardId: card.id,
            position: index,
            marked: false
        }));
    }

    /**
     * Marca una carta en la tabla si el jugador la tiene (ej. le pone un frijol).
     * 
     * @param boardCards Las cartas actuales de la tabla (mutará el estado de la carta encontrada).
     * @param cardId El ID de la carta que cantó el gritón.
     * @returns true si la carta estaba en la tabla y se marcó exitosamente.
     */
    public static markCard(boardCards: BoardCard[], cardId: number): boolean {
        const card = boardCards.find(c => c.cardId === cardId);
        if (card && !card.marked) {
            card.marked = true;
            return true;
        }
        return false;
    }

    /**
     * Verifica si la tabla está llena (condición básica de victoria de la lotería).
     * 
     * @param boardCards Las cartas actuales de la tabla.
     * @returns true si todas las cartas están marcadas.
     */
    public static isFullBoard(boardCards: BoardCard[]): boolean {
        if (boardCards.length !== 16) {
            return false;
        }
        return boardCards.every(c => c.marked);
    }
}
