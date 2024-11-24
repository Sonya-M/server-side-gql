import { db } from '@/db/db'
import { InsertIssues, SelectIssues, issues, users } from '@/db/schema'
import { GQLContext } from '@/types'
import { getUserFromToken, signin, signup } from '@/utils/auth'
import { and, asc, desc, eq, or, sql } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const resolvers = {
  Query: {
    me: (_parent, _args, ctx: GQLContext) => {
      return ctx.user
    },
    issues: async (parent, args, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      const { input } = args
      const andFilters = [eq(issues.userId, ctx.user.id)]
      if (input?.statuses) {
        const statusFilters = input.statuses.map((status) =>
          eq(issues.status, status)
        )

        andFilters.push(or(...statusFilters))
      }

      const data = await db.query.issues.findMany({
        where: and(...andFilters),
        orderBy: [
          asc(sql`case ${issues.status}
        when "backlog" then 1
        when "inprogress" then 2
        when "done" then 3
      end`),
          desc(issues.createdAt),
        ],
      })
      return data
    },
  },
  Mutation: {
    createIssue: async (_parent, args, ctx: GQLContext) => {
      if (!ctx.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      const { input } = args
      const data = await db
        .insert(issues)
        .values({ userId: ctx.user.id, ...input })
        .returning()
      return data.at(0)
    },
    signin: async (_parent, args, ctx) => {
      const { input } = args
      const data = await signin(input)
      if (!data || !data.user || !data.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      return {
        ...data.user,
        token: data.token,
      }
    },
    createUser: async (_parent, args, ctx) => {
      const { input } = args
      const data = await signup(input)
      if (!data || !data.user || !data.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      return {
        ...data.user,
        token: data.token,
      }
    },

    editIssue: async (_parent, args, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      const { input } = args
      const { id, ...update } = input
      const res = await db
        .update(issues)
        .set(update ?? {})
        .where(and(eq(issues.userId, ctx.user.id), eq(issues.id, id)))
        .returning()

      return res.at(0)
    },
    deleteIssue: async (_, { id }, ctx) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      await db.delete(issues).where(eq(issues.id, id))
      return id
    },
  },

  IssueStatus: {
    BACKLOG: 'backlog',
    TODO: 'todo',
    INPROGRESS: 'inprogress',
    DONE: 'done',
  },

  Issue: {
    user: (issue, args, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      return db.query.users.findFirst({
        where: eq(users.id, issue.userId),
      })
    },
  },

  User: {
    issues: (user, args, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 401 },
        })
      }
      return db.query.issues.findMany({
        where: eq(issues.userId, user.id),
      })
    },
  },
}
