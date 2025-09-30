"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsToNumber = wordsToNumber;
var map = {
    "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
    "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10,
    "once": 11, "doce": 12, "docena": 12, "veinte": 20, "treinta": 30
};
function wordsToNumber(word) {
    var _a;
    var w = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return (_a = map[w]) !== null && _a !== void 0 ? _a : null;
}
