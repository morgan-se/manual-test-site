import {db} from "../../server";
import {Story, Test, TestRun} from "../../db/schema";
import {count, eq} from "drizzle-orm";

const getProjectNumberOfTests = async (projectId: number): Promise<number> => {
    const stories = await db.select({ storyId: Story.storyId })
        .from(Story)
        .where(eq(Story.projectId, projectId));
    const storyNumberOfTests = await Promise.all(stories.map(s => getStoryNumberOfTests(s.storyId)));
    return storyNumberOfTests.reduce((a, b) => a + b, 0);
}

const getStoryNumberOfTests = async (storyId: number): Promise<number> => {
    const [numTests] = await db.select({ count: count() })
        .from(Test)
        .where(eq(Test.storyId, storyId));
    return numTests.count;
}

const getProjectNumberOfStories = async (projectId: number): Promise<number> => {
    const [numStories] = await db.select({ count: count() })
        .from(Story)
        .where(eq(Story.projectId, projectId));
    return numStories.count;
}

const getTestNumberOfRuns = async (testId: number): Promise<number> => {
    const [numTestRuns] = await db.select({ count: count() })
        .from(TestRun)
        .where(eq(TestRun.testId, testId));
    return numTestRuns.count;
}


export { getProjectNumberOfTests, getStoryNumberOfTests, getProjectNumberOfStories, getTestNumberOfRuns};