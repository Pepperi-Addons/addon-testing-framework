import "mocha";
import { TestResult } from "./tests-result";

export class Reporter extends Mocha.reporters.Base {

    constructor(runner: Mocha.Runner, private options: any = {}) {
        super(runner, options);

        const tests: Mocha.Test[] = [];
        const pending: Mocha.Test[] = [];
        const failures: Mocha.Test[] = [];
        const passes: Mocha.Test[] = [];
        const callback = options.reporterOptions.callback;
        
        runner.on(Mocha.Runner.constants.EVENT_TEST_END, function (test) {
            tests.push(test);
        });
        runner.on(Mocha.Runner.constants.EVENT_TEST_PASS, function (test) {
            passes.push(test);
        });
        runner.on(Mocha.Runner.constants.EVENT_TEST_FAIL, function (test) {
            failures.push(test);
        });
        runner.on(Mocha.Runner.constants.EVENT_TEST_PENDING, function (test) {
            pending.push(test);
        });
        
        runner.once(Mocha.Runner.constants.EVENT_RUN_END, () => {
            const obj: TestResult = {
                stats: this.stats,
                tests: tests.map(this.clean),
            };
            if (callback) {
                try {
                    callback(obj);
                } catch (err) {
                    console.error(`Reporter Error: ${(err as Error).message}`);
                    throw err;
                }
            } else {
                process.stdout.write(JSON.stringify(obj, undefined, 2));
            }
        });
    }

    clean(test: Mocha.Test) {
        // create the title
        let title = test.title;
        let parent = test.parent;
        while (parent) {
            title = parent.title + ' -> ' + title;
            parent = parent.parent;
        }

        return {
            title: title,
            duration: test.duration || 0,
            failed: test.isFailed(),
            passed: test.isPassed(),
            failure: test.err?.message,
        };
    }
}