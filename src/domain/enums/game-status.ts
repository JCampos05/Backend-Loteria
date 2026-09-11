/**
 * ⚠️ PROPUESTA — este archivo reemplazaría al game-status.ts actual del repo.
 *
 * El enum actual del equipo solo tiene IN_PROGRESS / FINISHED, pero el
 * entregable de César pide WAITING / PLAYING / FINISHED para el ciclo de
 * la partida. Antes de sustituir el archivo real y correr una migración
 * nueva de Prisma, hay que platicarlo con:
 *   - Diego Espíritu (dueño del schema.prisma / migraciones)
 *   - Cualquiera que ya esté usando GameStatus.IN_PROGRESS en su código
 *
 * Si el equipo da luz verde, los pasos serían:
 *   1) Reemplazar este archivo en el repo real.
 *   2) Actualizar el enum GameStatus en prisma/schema.prisma con los mismos
 *      valores (WAITING, PLAYING, FINISHED).
 *   3) Correr `npm run db:migrate` para generar la migración correspondiente.
 */
export enum GameStatus {
    WAITING = 'WAITING',
    PLAYING = 'PLAYING',
    FINISHED = 'FINISHED',
}
