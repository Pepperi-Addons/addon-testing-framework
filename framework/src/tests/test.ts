import { BaseTest } from "./base";

/**
 * A simple test with one test case.
 */
export class Test extends BaseTest {
    
    constructor(public title: string, private testFunc: (expect: Chai.ExpectStatic) => void) {
        super();
    }

    tests(describe: (suiteTitle: string, func: () => void) => void, it: (name: string, fn: Mocha.Func) => void, expect: Chai.ExpectStatic): void {
        it(this.title, () => {
            this.testFunc(expect);
        });
    }
}