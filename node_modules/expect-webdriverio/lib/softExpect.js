import { expect } from './index.js';
import { SoftAssertService } from './softAssert.js';
const isPossibleMatcher = (propName) => propName.startsWith('to') && propName.length > 2;
const createSoftExpect = (actual) => {
    const softService = SoftAssertService.getInstance();
    return new Proxy({}, {
        get(target, prop) {
            const propName = String(prop);
            if (propName === 'not') {
                return createSoftNotProxy(actual, softService);
            }
            if (propName === 'resolves' || propName === 'rejects') {
                return createSoftChainProxy(actual, propName, softService);
            }
            if (isPossibleMatcher(propName)) {
                return createSoftMatcher(actual, propName, softService);
            }
            return undefined;
        }
    });
};
const createSoftNotProxy = (actual, softService) => {
    return new Proxy({}, {
        get(_target, prop) {
            const propName = String(prop);
            return isPossibleMatcher(propName) ? createSoftMatcher(actual, propName, softService, 'not') : undefined;
        }
    });
};
const createSoftChainProxy = (actual, chainType, softService) => {
    return new Proxy({}, {
        get(_target, prop) {
            const propName = String(prop);
            return isPossibleMatcher(propName) ? createSoftMatcher(actual, propName, softService, chainType) : undefined;
        }
    });
};
const createSoftMatcher = (actual, matcherName, softService, prefix) => {
    return (...args) => {
        try {
            let expectChain = expect(actual);
            if (prefix === 'not') {
                expectChain = expectChain.not;
            }
            else if (prefix === 'resolves') {
                expectChain = expectChain.resolves;
            }
            else if (prefix === 'rejects') {
                expectChain = expectChain.rejects;
            }
            const assertionResult = expectChain[matcherName](...args);
            if (assertionResult instanceof Promise) {
                return assertionResult.catch((error) => handlingMatcherFailure(prefix, matcherName, softService, error));
            }
            return assertionResult;
        }
        catch (error) {
            return handlingMatcherFailure(prefix, matcherName, softService, error);
        }
    };
};
function handlingMatcherFailure(prefix, matcherName, softService, error) {
    const fullMatcherName = prefix ? `${prefix}.${matcherName}` : matcherName;
    softService.addFailure(error, fullMatcherName);
    return {
        pass: true,
        message: () => `Soft assertion failed: ${fullMatcherName}`
    };
}
export default createSoftExpect;
