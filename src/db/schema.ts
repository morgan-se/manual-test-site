import {int, sqliteTable, text} from "drizzle-orm/sqlite-core"
import {sql} from "drizzle-orm";

export const Project = sqliteTable("projects", {
    projectId: int().primaryKey({autoIncrement: true}),
    title: text().notNull(),
    description: text().notNull(),
})

export const Story = sqliteTable("story",{
    storyId: int().primaryKey({autoIncrement: true}),
    projectId: int().references(() => Project.projectId).notNull(),
    title: text().notNull(),
    description: text().notNull(),
})

export const Test = sqliteTable("test",{
    testId: int().primaryKey({autoIncrement: true}),
    storyId: int().references(() => Story.storyId).notNull(),
    title: text().notNull(),
    description: text().notNull(),
})


export const TestRun = sqliteTable("testRun",{
    testRunId: int().primaryKey({autoIncrement: true}),
    testId: int().references(() => Test.testId).notNull(),
    timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
    outcome: text().$type<"pass" | "fail" | "error" | "unknown">().notNull(),
    notes: text(),
})