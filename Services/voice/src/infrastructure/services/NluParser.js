"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = parseCommand;
var wordsToNumber_1 = require("../utils/wordsToNumber");
var addWords = ["agrega", "añade", "pon", "mete", "agregar", "añadir"];
var forbiddenWords = ["quitar", "elimina", "pagar", "paga", "cobrar", "cambiar", "modificar", "checkout", "pago"];
function parseCommand(text) {
    var raw = (text || "").trim().toLowerCase();
    for (var _i = 0, forbiddenWords_1 = forbiddenWords; _i < forbiddenWords_1.length; _i++) {
        var fw = forbiddenWords_1[_i];
        if (raw.includes(fw))
            return { intent: "forbidden", raw: raw };
    }
    var foundAdd = false;
    for (var _a = 0, addWords_1 = addWords; _a < addWords_1.length; _a++) {
        var w = addWords_1[_a];
        if (raw.startsWith(w + " ") || raw.includes(" " + w + " ") || raw === w) {
            foundAdd = true;
            break;
        }
    }
    if (!foundAdd)
        return { intent: "unknown", raw: raw };
    // Remove leading verb
    var after = raw;
    for (var _b = 0, addWords_2 = addWords; _b < addWords_2.length; _b++) {
        var w = addWords_2[_b];
        if (after.startsWith(w + " ")) {
            after = after.slice(w.length).trim();
            break;
        }
        else if (after === w) {
            after = "";
            break;
        }
    }
    var tokens = after.split(/\s+/).filter(Boolean);
    var quantity;
    var productName = after;
    if (tokens.length) {
        var first = tokens[0].replace(/[.,]/g, "");
        var n = Number(first);
        if (!isNaN(n) && n > 0) {
            quantity = Math.trunc(n);
            productName = tokens.slice(1).join(" ");
        }
        else {
            var w2n = (0, wordsToNumber_1.wordsToNumber)(first);
            if (w2n && w2n > 0) {
                quantity = w2n;
                productName = tokens.slice(1).join(" ");
            }
            else if (["un", "una", "uno"].includes(first)) {
                quantity = 1;
                productName = tokens.slice(1).join(" ");
            }
            else {
                productName = after;
            }
        }
    }
    if (!productName || productName.trim() === "")
        return { intent: "unknown", raw: raw };
    return { intent: "add", quantity: quantity, productName: productName.trim(), raw: raw };
}
