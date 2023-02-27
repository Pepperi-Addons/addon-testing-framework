import "mocha";

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
            const obj = {
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
        return {
            title: test.title,
            duration: test.duration,
            failed: test.isFailed(),
            passed: test.isPassed(),
            suite: test.parent?.title,
            superSuite: test.parent?.parent?.title,
            failure: test.err?.message,
        };
    }
}