type Project = {
    projectId: number,
    title: string,
    description: string,
    status: string,
    numStories: number,
    numTests: number,
}

type Story = {
    projectId: number,
    storyId: number,
    storyIdentifier: string,
    title: string,
    description: string,
    status: string,
    numTests: number,
}

type Test = {
    // projectId: number,
    storyId: number,
    testId: number,
    testIdentifier: string,
    title: string,
    description: string,
    status: string,
    numRuns: number
}

type TestRun = {
    // projectId: number,
    // storyId: number,
    testId: number,
    testRunId: number,
    timestamp: string,
    outcome: string,
    notes: string

}