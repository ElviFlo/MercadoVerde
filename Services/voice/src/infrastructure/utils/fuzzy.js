"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.similarity = similarity;
function similarity(a, b) {
    if (!a || !b)
        return 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a === b)
        return 1;
    if (a.includes(b) || b.includes(a))
        return 0.9;
    var as = new Set(a.split(/\s+/));
    var bs = new Set(b.split(/\s+/));
    var inter = __spreadArray([], as, true).filter(function (x) { return bs.has(x); }).length;
    var union = new Set(__spreadArray(__spreadArray([], as, true), bs, true)).size;
    if (union === 0)
        return 0;
    return inter / union;
}
