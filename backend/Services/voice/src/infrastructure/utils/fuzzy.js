"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuzzyMatch = fuzzyMatch;
function fuzzyMatch(input, target) {
    var distance = 0;
    for (var i = 0; i < Math.min(input.length, target.length); i++) {
        if (input[i] !== target[i])
            distance++;
    }
    return 1 - distance / Math.max(input.length, target.length);
}
