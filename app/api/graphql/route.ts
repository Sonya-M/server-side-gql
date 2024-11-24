import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { NextRequest, NextResponse } from 'next/server'
import { schema } from './schema'
import { resolvers } from './resolvers'
import { getUserFromToken } from '@/utils/auth'

// this will give you the apollo server playground
let plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins = [
    ApolloServerPluginLandingPageProductionDefault({
      embed: true,
      graphRef: 'myGraph@prod',
    }),
  ]
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
}
// end

const server = new ApolloServer({
  resolvers,
  plugins,
  typeDefs: schema,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  // this will run before your resolvers
  context: async (req) => {
    // attach user to ctx if already signed in
    const user = await getUserFromToken(req.headers.get('authorization') ?? '')
    return {
      req,
      user,
    }
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
