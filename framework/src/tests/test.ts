import { BaseTest } from "./base";

type TestFunc = (this: BaseTest, expect: Chai.ExpectStatic) => Promise<void> | void;

/**
 * A simple test with one test case.
 */
export class Test extends BaseTest {
    
    constructor(public title: string, private testFunc: TestFunc) {
        super();
    }

    tests(describe: (suiteTitle: string, func: () => void) => void, it: (name: string, fn: Mocha.Func) => void, expect: Chai.ExpectStatic): void {
        it(this.title, async () => {
            await this.testFunc.apply(this, [expect]);
        });
    }
}