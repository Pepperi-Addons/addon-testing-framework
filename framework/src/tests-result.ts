export interface TestResult {
    stats: Mocha.Stats;
    tests: {
        title: string;
        duration: number;
        failed: boolean;
        passed: boolean;
        failure?: string;
    }[];
}