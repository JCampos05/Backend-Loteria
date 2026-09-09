-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'FINISHED');

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "is_host" BOOLEAN NOT NULL DEFAULT false,
    "connected" BOOLEAN NOT NULL DEFAULT true,
    "socket_id" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "winner_id" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_boards" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "player_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_cards" (
    "id" TEXT NOT NULL,
    "player_board_id" TEXT NOT NULL,
    "card_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "marked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "board_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "called_cards" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "card_id" INTEGER NOT NULL,
    "call_order" INTEGER NOT NULL,
    "called_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "called_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "win_claims" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "is_valid" BOOLEAN NOT NULL,
    "reason" VARCHAR(255),
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "win_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_code_key" ON "rooms"("code");

-- CreateIndex
CREATE INDEX "players_room_id_idx" ON "players"("room_id");

-- CreateIndex
CREATE INDEX "games_room_id_idx" ON "games"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "cards_name_key" ON "cards"("name");

-- CreateIndex
CREATE UNIQUE INDEX "player_boards_game_id_player_id_key" ON "player_boards"("game_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "board_cards_player_board_id_card_id_key" ON "board_cards"("player_board_id", "card_id");

-- CreateIndex
CREATE UNIQUE INDEX "board_cards_player_board_id_position_key" ON "board_cards"("player_board_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "called_cards_game_id_card_id_key" ON "called_cards"("game_id", "card_id");

-- CreateIndex
CREATE UNIQUE INDEX "called_cards_game_id_call_order_key" ON "called_cards"("game_id", "call_order");

-- CreateIndex
CREATE INDEX "win_claims_game_id_idx" ON "win_claims"("game_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_boards" ADD CONSTRAINT "player_boards_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_boards" ADD CONSTRAINT "player_boards_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_cards" ADD CONSTRAINT "board_cards_player_board_id_fkey" FOREIGN KEY ("player_board_id") REFERENCES "player_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_cards" ADD CONSTRAINT "board_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_cards" ADD CONSTRAINT "called_cards_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "called_cards" ADD CONSTRAINT "called_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "win_claims" ADD CONSTRAINT "win_claims_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "win_claims" ADD CONSTRAINT "win_claims_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
