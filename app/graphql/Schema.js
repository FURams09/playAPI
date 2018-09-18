import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
  } from 'graphql/type';

import db from '../db/db';
  
  
var postType = new GraphQLObjectType({
name: 'post',
description: 'post item',
fields: () => ({
    _id: {
    type: GraphQLString,
    description: 'The id of the post.',
    },
    title: {
    type: GraphQLString,
    description: 'The name of the post.',
    },
    category: {
    type: GraphQLString,
    description: 'The category of the post.'
    },
    content: {
        type: GraphQLString,
        description: 'The content of the post.'
    }
})
});

var schema = new GraphQLSchema({
query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
    post: {
        type: new GraphQLList(postType),
        args: {
        _id: {
            name: '_id',
            type: GraphQLString
        }
        },
        resolve: (root, {_id}, source) => {
            if (_id) {
                return db.redux.getPost(_id, source);
            } else {
                return db.redux.getPosts(source);
            }
            
        }
    }
    }
})
});

export default schema;