import { ServicesContainer } from "../services/services-container";
import { BaseTest } from "./base";

/**
 * A test that contains a list of other tests.
 */
export class TestGroup extends BaseTest {
    
    constructor(public title: string, private testList: BaseTest[]) {
        super();
    }

    init(container: ServicesContainer): void {
        super.init(container);
        for (const test of this.testList) {
            test.init(this.container);
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