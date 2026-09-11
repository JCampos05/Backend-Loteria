
import { Card } from '../entities/card';

export interface ICardRepository {
  findAll(): Promise<Card[]>;
  findById(id: number): Promise<Card | null>;
  getRandomCards(count: number): Promise<Card[]>;
}
