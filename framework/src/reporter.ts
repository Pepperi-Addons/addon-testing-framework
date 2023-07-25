import "mocha";
import { TestResult } from "./tests-result";

export class Reporter extends Mocha.reporters.Base {

    constructor(runner: Mocha.Runner, private options: any = {}) {
        super(runner, options);

        const tests: Mocha.Test[] = [];
        const hooks: Mocha.Hook[] = [];
        const callback = options.reporterOptions.callback;
        
        runner.on(Mocha.Runner.constants.EVENT_TEST_END, function (test) {
            tests.push(test);
            const mark = test.isPassed() ? '\u2705' : '\u274C';
            console.log(`Reporter: ${mark} ${test.title} finished with status ${test.state} in ${test.duration}ms`);
        });
        runner.on(Mocha.Runner.constants.EVENT_TEST_FAIL, function (test) {
            console.error(`Reporter: ${test.title} failed with error: ${test.err?.message} in ${test.duration}ms`);
        });
        runner.on(Mocha.Runner.constants.EVENT_HOOK_BEGIN, function (hook: Mocha.Hook) {
            hooks.push(hook);
        });
        
        runner.once(Mocha.Runner.constants.EVENT_RUN_END, () => {
            
            const obj: TestResult = {
                stats: this.stats,
                hooks: hooks.map(this.clean),
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

    clean(test: Mocha.Test | Mocha.Hook) {
        // create the title
        let title = test.title;
        let parent = test.parent;
        const failed = test.state === 'failed';
        while (parent) {
            title = parent.title + ' -> ' + title;
            parent = parent.parent;
        }

        return {
            title: title,
            duration: test.duration || 0,
            failed: failed,
            passed: !failed,
            // for some reason hooks don't have err property exposed but that is where the error is
            // so let's downcast to any and hope for the best
            failure: (test as any).err?.message,
        };
    }
}