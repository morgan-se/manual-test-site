import {db} from "../../server";
import {eq} from "drizzle-orm";
import {Story, Test, TestRun} from "../../db/schema";

const outcomePriority = { pass: 0, unknown: 1, error: 2, fail: 3 };

const determineOutcome = (outcomes: ("pass" | "fail" | "error" | "unknown")[]): "pass" | "fail" | "error" | "unknown" => {
    if (outcomes.length === 0)
        return "unknown";
    return outcomes.reduce((acc, outcome) =>
            outcomePriority[outcome] > outcomePriority[acc] ? outcome : acc,
        "pass"
    );
};

const getProjectOutcome = async (projectId: number): Promise<"pass" | "fail" | "error" | "unknown"> => {
    const stories = await db.select({ storyId: Story.storyId })
        .from(Story)
        .where(eq(Story.projectId, projectId));
    const storyOutcomes = await Promise.all(stories.map(s => getStoryOutcome(s.storyId)));
    return determineOutcome(storyOutcomes);
}

const getStoryOutcome = async (storyId: number): Promise<"pass" | "fail" | "error" | "unknown"> => {
    const tests = await db.select({ testId: Test.testId })
        .from(Test)
        .where(eq(Test.storyId, storyId));

    const testOutcomes = await Promise.all(tests.map(test => getTestOutcome(test.testId)));
    return determineOutcome(testOutcomes);
}

const getTestOutcome = async (testId: number): Promise<"pass" | "fail" | "error" | "unknown"> => {
    const testRunOutcomes = await db.select({ outcome: TestRun.outcome })
        .from(TestRun)
        .where(eq(TestRun.testId, testId));

    return determineOutcome(testRunOutcomes.map(tr => tr.outcome));
}

export {getProjectOutcome, getStoryOutcome, getTestOutcome}