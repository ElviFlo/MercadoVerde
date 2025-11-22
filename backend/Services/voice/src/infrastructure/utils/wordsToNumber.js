"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsToNumber = wordsToNumber;
// src/utils/wordsToNumber.ts
var map = {
    cero: 0,
    uno: 1,
    una: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10,
};
function wordsToNumber(word) {
    var normalized = word.toLowerCase().trim();
    if (normalized in map)
        return map[normalized];
    var parsed = parseInt(normalized, 10);
    if (!isNaN(parsed))
        return parsed;
    return 1; // por defecto, si no reconoce la palabra, asume 1
}
