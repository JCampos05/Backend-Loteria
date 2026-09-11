import { PrismaClient } from '@prisma/client';
import { Card } from '../../domain/entities/card';
import { ICardRepository } from '../../domain/repositories/ICardRepository';

export class PrismaCardRepository implements ICardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Card[]> {
    const rawCards = await this.prisma.card.findMany({
      orderBy: { id: 'asc' },
    });
    return rawCards.map((c) => new Card(c.id, c.name, c.imageUrl));
  }

  async findById(id: number): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) return null;
    return new Card(card.id, card.name, card.imageUrl);
  }

  async getRandomCards(count: number): Promise<Card[]> {
    const allCards = await this.findAll();
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
