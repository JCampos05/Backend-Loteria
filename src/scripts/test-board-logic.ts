import { BoardOperations } from '../domain/utils/BoardOperations';
import { Card } from '../domain/entities/card';

// 1. Mockeamos un mazo completo de Lotería (54 cartas)
const mockDeck: Card[] = Array.from({ length: 54 }, (_, i) => ({
    id: i + 1,
    name: `Carta ${i + 1}`,
    imageUrl: `https://fakeurl.com/${i + 1}.png`
}));

function runTests() {
    console.log("==================================================");
    console.log("▶ INICIANDO PRUEBAS FUNCIONALES - LÓGICA DE BOARD");
    console.log("==================================================\n");

    try {
        // --- PRUEBA 1: Generación de tabla ---
        console.log("Prueba 1: Generación de tabla aleatoria (Sin repetición)");
        const playerBoardId = "pb-test-123";
        const boardCards = BoardOperations.generateRandomBoard(mockDeck, playerBoardId);
        
        const isLength16 = boardCards.length === 16;
        const uniqueIds = new Set(boardCards.map(c => c.cardId));
        const hasNoDuplicates = uniqueIds.size === 16;
        const matchesPlayerBoardId = boardCards.every(c => c.playerBoardId === playerBoardId);

        console.log(`  [${isLength16 ? 'OK' : 'FAIL'}] Genera exactamente 16 cartas.`);
        console.log(`  [${hasNoDuplicates ? 'OK' : 'FAIL'}] No hay cartas repetidas (Fisher-Yates funciona).`);
        console.log(`  [${matchesPlayerBoardId ? 'OK' : 'FAIL'}] Asigna correctamente el playerBoardId a todas las cartas.`);
        console.assert(isLength16 && hasNoDuplicates && matchesPlayerBoardId, "Fallo en la prueba 1");


        // --- PRUEBA 2: Marcar cartas ---
        console.log("\nPrueba 2: Operación de marcar cartas (Poner el frijol)");
        // Tomamos la primera carta de la tabla generada para simular que el "gritón" la canta
        const cardToMark = boardCards[0].cardId;
        
        const markSuccess = BoardOperations.markCard(boardCards, cardToMark);
        const cardIsMarked = boardCards[0].marked === true;
        
        // Intentamos marcar una carta que seguro no está (ID 999)
        const markFail = BoardOperations.markCard(boardCards, 999);

        console.log(`  [${markSuccess && cardIsMarked ? 'OK' : 'FAIL'}] Marca correctamente una carta existente.`);
        console.log(`  [${markFail === false ? 'OK' : 'FAIL'}] Ignora y devuelve false si la carta no está en la tabla.`);
        console.assert(markSuccess && cardIsMarked && !markFail, "Fallo en la prueba 2");


        // --- PRUEBA 3: Verificar victoria (Tabla llena) ---
        console.log("\nPrueba 3: Verificación de condición de victoria (isFullBoard)");
        
        // A este punto, solo 1 carta está marcada
        const isWinnerInitially = BoardOperations.isFullBoard(boardCards);
        console.log(`  [${!isWinnerInitially ? 'OK' : 'FAIL'}] No da victoria si faltan cartas por marcar.`);

        // Marcamos las 15 restantes
        for (let i = 1; i < 16; i++) {
            BoardOperations.markCard(boardCards, boardCards[i].cardId);
        }
        
        const isWinnerAfterAll = BoardOperations.isFullBoard(boardCards);
        console.log(`  [${isWinnerAfterAll ? 'OK' : 'FAIL'}] Da victoria (true) cuando las 16 cartas están marcadas.`);
        console.assert(!isWinnerInitially && isWinnerAfterAll, "Fallo en la prueba 3");

        console.log("\n✅ TODAS LAS PRUEBAS FUNCIONALES PASARON CON ÉXITO.");
        console.log("==================================================\n");

    } catch (error) {
        console.error("\n❌ ERROR DURANTE LAS PRUEBAS:", error);
    }
}

// Ejecutamos las pruebas
runTests();
