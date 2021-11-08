import { ServerResponse } from 'http'

import { MicroRequest } from 'apollo-server-micro/dist/types'

import { ApolloServer } from 'apollo-server-micro'
import type { PageConfig } from 'next'
import type { Resolvers } from '@apollo/client'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ObjectId } from 'mongodb'
import { typeDefs } from '../../schema'
import type {
  Bookmark,
  Collection,
  CollectionInput,
  BookmarkInput,
} from 'types/index'
import clientPromise from 'utils/mongodb'

export const config: PageConfig = {
  api: { bodyParser: false },
}
// #TODO remove this once we have sessions
const commonName = 'HALL.MICHAEL.0123456789'

const resolvers: Resolvers = {
  Query: {
    collections: async (_, args, { db }) => {
      try {
        const foundUser = await db
          .collection('users')
          .find({ commonName: commonName })
          .toArray()

        return foundUser[0].mySpace
      } catch (e) {
        console.error('error in query collections', e)
      }
    },
  },
  Mutation: {
    addCollection: async (_, { title, bookmarks }, { db }) => {
      const newBookmarks: Bookmark[] = bookmarks.map((input: any) => ({
        _id: new ObjectId(),
        url: input.url,
        label: input.label,
        description: input.description,
      }))

      const newCollection: CollectionInput = {
        _id: new ObjectId(),
        title: title,
        bookmarks: newBookmarks,
      }

      const query = {
        commonName: commonName,
      }

      const updateDocument = {
        $push: {
          mySpace: newCollection,
        },
      }

      try {
        await db.collection('users').updateOne(query, updateDocument)
        return newCollection
      } catch (e) {
        console.error('error in add collection', e)
        return e
      }
    },
    editCollection: async (_, { _id, title }, { db }) => {
      const query = {
        commonName: commonName,
        'mySpace._id': new ObjectId(_id),
      }

      const updateDocument = {
        $set: {
          'mySpace.$.title': title,
        },
      }

      try {
        await db.collection('users').updateOne(query, updateDocument)

        const c = await db
          .collection('users')
          .find({ 'mySpace._id': new ObjectId(_id) })
          .project({ 'mySpace.$': 1, _id: 0 })
          .toArray()

        return c[0].mySpace[0]
      } catch (e) {
        console.error('error in edit collection', e)
        return e
      }
    },
    removeCollection: async (root, { _id }, { db }) => {
      const query = {
        commonName: commonName,
      }

      const updateDocument = {
        $pull: {
          mySpace: {
            _id: new ObjectId(_id),
          },
        },
      }

      try {
        // save collection in const to return if successful
        const collectionQuery = await db
          .collection('users')
          .find({
            commonName: commonName,
            mySpace: {
              $elemMatch: {
                _id: new ObjectId(_id),
              },
            },
          })
          .project({
            'mySpace.$': 1,
            _id: 0,
          })
          .toArray()

        // #TODO add error check
        const removedCollection: Collection = collectionQuery[0].mySpace[0]

        // Remove the collection from the database
        await db.collection('users').updateOne(query, updateDocument)

        return removedCollection
        // #TODO update to use findAndModify like remove bookmark? would simplify
      } catch (e) {
        console.error('error in remove collection', e)
        return e
      }
    },
    addBookmark: async (root, { collectionId, url, label }, { db }) => {
      const newBookmark: Bookmark = {
        _id: new ObjectId(),
        url,
        label,
      }

      const query = {
        'mySpace._id': new ObjectId(collectionId),
      }

      const updateDocument = {
        $push: {
          'mySpace.$.bookmarks': newBookmark,
        },
      }
      try {
        await db
          .collection('users')
          .findAndModify(query, [], updateDocument, { new: true })

        return newBookmark
      } catch (e) {
        console.error('error in add bookmark', e)
        return e
      }
    },
    removeBookmark: async (root, { _id, collectionId }, { db }) => {
      const query = {
        commonName: commonName,
        'mySpace._id': new ObjectId(collectionId),
      }

      const updateDocument = {
        $pull: {
          'mySpace.$.bookmarks': {
            _id: new ObjectId(_id),
          },
        },
      }

      try {
        // save collection in const to return if successful
        const updated = await db
          .collection('users')
          .findAndModify(query, [], updateDocument, { new: true })

        const updatedCollection = updated?.value?.mySpace?.filter((c: any) => {
          return String(c._id) === String(collectionId)
        })

        return updatedCollection[0]
      } catch (e) {
        console.error('error in remove collection', e)
        return e
      }
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  context: async () => {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    return { db }
  },
})

const startServer = apolloServer.start()

export default async function handler(req: MicroRequest, res: ServerResponse) {
  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}
