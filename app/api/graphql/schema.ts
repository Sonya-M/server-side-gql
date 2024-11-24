export const schema = `#graphql

input EditIssueInput {
  name: String
  content: String
  status: IssueStatus
  id: ID!
}

type Issue {
  createdAt: String!
  id: ID!
  name: String!
  content: String!
  userId: ID!
  projectId: ID!
  status: IssueStatus
  user: User!
}

input CreateIssueInput {
  name: String!
  content:String!
  status: IssueStatus
}

enum IssueStatus {
  DONE 
  TODO 
  INPROGRESS
  BACKLOG
}

type User {
 id: ID!
 email: String! 
 createdAt: String!
 token: String!
 issues: [Issue!]!
}

input AuthInput {
  email: String!
  password:String!
}

input IssuesFilterInput {
  statuses: [IssueStatus!]
}

type Query {
  me: User
  issues(input: IssuesFilterInput): [Issue!]!
}

type Mutation {
  signin(input: AuthInput!): User
  createUser(input: AuthInput!): User 
  createIssue(input: CreateIssueInput!): Issue
  editIssue(input: EditIssueInput!): Issue!
  deleteIssue(id: ID!): ID!
}
`
