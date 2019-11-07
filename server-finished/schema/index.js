import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    users(name: String, email: String): [User!]!
    posts: [Post!]!
    comments: [Comment!]!
    me: User
  }

  type Mutation {
    createPost(post: CreatePostInput): Post!
    updatePost(id: ID!, post: UpdatePostInput!): Post!
    removePost(id: ID!): Post!
    createComment(comment: CreateCommentInput): Comment!
    updateComment(id: ID!, comment: UpdateCommentInput!): Comment!
    removeComment(id: ID!): Comment!
    login(email: String!): AuthPayload!
  }

  input CreatePostInput {
    title: String!
    body: String!
    # authorId: ID!
  }

  input UpdatePostInput {
    title: String!
    body: String!
  }

  input CreateCommentInput {
    text: String!
    postId: ID!
    # authorId: ID!
  }

  input UpdateCommentInput {
    text: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

export default typeDefs;
