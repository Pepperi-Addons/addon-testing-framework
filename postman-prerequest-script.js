
function test(obj) {
    
    const passes = obj.stats.passes;
    pm.test(`${passes} Successfull tests`, function () {
        pm.expect(passes).to.be.greaterThan(0)
    });

    const failures = obj.stats.failures;
    pm.test(`${failures} Failed tests`, function () {
        pm.expect(failures, "").to.be.equal(0)
    });

    for (const hook of obj.hooks) {
        pm.test(`${hook.title} took: ${hook.duration}ms`, function () {
            pm.expect(hook.passed, hook.failure).to.be.true;
        });
    }

    for (const test of obj.tests) {
        pm.test(`${test.title} took: ${test.duration}ms`, function () {
            pm.expect(test.passed, test.failure).to.be.true;
        });
    }
}

test(pm.response.json())