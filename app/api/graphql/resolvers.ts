// resolver examples, returning hard-coded data, no db
const resolvers = {
  SearchType: {
    __resolveType: function (obj: Record<string, unknown>) {
      if (obj.species) {
        return 'Animal'
      }
      return 'Person'
    },
  },

  Color: {
    BLUE: '#89CFF0',
    PINK: '#FFC0CB',
    YELLOW: '#ffde21',
  },

  Person: {
    // field level resolver example:
    name: function (parent: { name: string }) {
      return parent.name.toUpperCase()
    },
    pets: function (parent) {
      return [{ name: 'peto', species: 'dog' }]
    },
  },

  Query: {
    search: function () {
      return [
        { name: 'John', id: 'xxx' },
        { name: 'Jane', species: 'cat' },
      ]
    },
    me: function () {
      return 'me'
    },
    people: function () {
      return [{ name: 'whatever', id: 'xyz' }]
    },
  },
}

export default resolvers
