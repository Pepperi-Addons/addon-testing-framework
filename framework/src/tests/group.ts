import { BaseTest } from "./base";

/**
 * A test that contains a list of other tests.
 */
export class TestGroup extends BaseTest {
    
    constructor(public title: string, private testList: BaseTest[]) {
        super();
    }

    init(): void {
        for (const test of this.testList) {
            test.eventService = this.eventService;
            test.init();
        }
    }

    tests(describe: (suiteTitle: string, func: () => void) => void, it: (name: string, fn: Mocha.Func) => void, expect: Chai.ExpectStatic): void {
        describe(this.title, () => {
            for (const test of this.testList) {
                test.tests(describe, it, expect);
            }
        });
    }
}