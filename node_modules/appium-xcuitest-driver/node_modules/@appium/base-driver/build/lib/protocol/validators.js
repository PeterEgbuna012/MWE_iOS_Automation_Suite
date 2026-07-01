"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
exports.validators = {
    setUrl: (url) => {
        // either an `xyz://`, `about:`, or `data:` scheme is allowed
        if (!url || !url.match(/^([a-zA-Z0-9_+.-]+:\/\/)|(about:)|(data:)/)) {
            throw new Error('Url or Uri must start with <scheme>://');
        }
    },
    setNetworkConnection: (type) => {
        if (!isNumber(type) || [0, 1, 2, 4, 6].indexOf(type) === -1) {
            throw new Error('Network type must be one of 0, 1, 2, 4, 6');
        }
    },
};
function isNumber(o) {
    return typeof o === 'number' || !Number.isNaN(parseInt(o, 10)) || !Number.isNaN(parseFloat(o));
}
//# sourceMappingURL=validators.js.map