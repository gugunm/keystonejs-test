import { list } from '@keystone-6/core'

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  checkbox,
} from '@keystone-6/core/fields'

import { document } from '@keystone-6/fields-document'
import { Lists } from '.keystone/types'

type Session = {
  data: {
    id: string
    isAdmin: boolean
  }
}

const isAdmin = ({ session }: { session: Session }) => session?.data.isAdmin

const isLogin = ({ session }: { session: Session }) => !!session?.data

export const lists: Lists = {
  User: list({
    access: {
      operation: {
        // query: isAdmin,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      // filter: '',
      // item: ''
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      isAdmin: checkbox(),
      posts: relationship({ ref: 'Post.author', many: true }),
      todos: relationship({ ref: 'Todo.assignedTo', many: true }),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'email', 'isAdmin', 'posts'],
      },
    },
  }),

  Post: list({
    access: {
      operation: {
        query: isLogin,
        create: isLogin,
        update: isLogin,
        delete: isLogin,
      },
    },
    fields: {
      title: text(),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        defaultValue: 'draft',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      author: relationship({ ref: 'User.posts', many: false }),
      // relationship({
      //   ref: 'User.posts',
      //   ui: {
      //     displayMode: 'cards',
      //     cardFields: ['name', 'email'],
      //     inlineEdit: { fields: ['name', 'email'] },
      //     linkToItem: true,
      //     inlineCreate: { fields: ['name', 'email'] },
      //   },
      // }),
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
    },
  }),

  Tag: list({
    access: {
      operation: {
        query: isLogin,
        create: isLogin,
        update: isLogin,
        delete: isLogin,
      },
    },
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),

  Todo: list({
    access: {
      operation: {
        query: isLogin,
        create: isLogin,
        update: isLogin,
        delete: isLogin,
      },
    },
    fields: {
      label: text({ validation: { isRequired: true } }),
      priority: select({
        type: 'enum',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      }),
      isComplete: checkbox(),
      assignedTo: relationship({ ref: 'User.todos', many: false }),
      finishBy: timestamp(),
    },
  }),
}
