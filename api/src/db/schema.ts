import {int, sqliteTable, text} from "drizzle-orm/sqlite-core"
import {eq, InferModel, sql} from "drizzle-orm";
import {db} from "../server";

export const Project = sqliteTable("projects", {
    projectId: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    description: text().notNull(),
})

// todo: is it worth making the storyIdentifier and testIdentifier unique across projects/stories respectively
export const Story = sqliteTable("story",{
    storyId: int().primaryKey({autoIncrement: true}),
    storyIdentifier: text().notNull(),
    projectId: int().references(() => Project.projectId).notNull(),
    title: text().notNull(),
    description: text().notNull(),
})

export const Test = sqliteTable("test",{
    testId: int().primaryKey({autoIncrement: true}),
    testIdentifier: text().notNull(),
    storyId: int().references(() => Story.storyId).notNull(),
    title: text().notNull(),
    description: text().notNull(),
})


export const TestRun = sqliteTable("testRun",{
    testRunId: int().primaryKey({autoIncrement: true}),
    testId: int().references(() => Test.testId).notNull(),
    timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
    outcome: text().$type<"pass" | "fail" | "error" | "unknown">().notNull(),
    notes: text().notNull(),
})
