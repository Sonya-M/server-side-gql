const schema = `#graphql

enum Color {
  BLUE
  PINK
  YELLOW
}

type Animal {
  species: String!
  name: String!
}

type Person {
  name: String!
  id: ID!
  faveColor: Color
  pets: [Animal!]!
}

union SearchType = Animal | Person

type Query {
  me: String!
  people: [Person!]!
  search: [SearchType]!
}


`

export default schema
