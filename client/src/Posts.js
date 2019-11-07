import React from 'react';

import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const POSTS = gql`
  query {
    posts {
      id
      title
      body
    }
  }
`;

const CREATE_POSTS = gql`
  mutation createPost($post: CreatePostInput) {
    createPost(post: $post) {
      id
      title
      body
    }
  }
`;

const newPost = { title: 'Simple test', body: 'Cache should be updated' };

const Posts = () => {
  const { loading: queryLoading, error, data } = useQuery(POSTS, {});
  const [createPost, { loading: mutationLoading }] = useMutation(CREATE_POSTS, {
    update(
      cache,
      {
        data: { createPost }
      }
    ) {
      const { posts } = cache.readQuery({ query: POSTS });
      cache.writeQuery({
        query: POSTS,
        data: {
          posts: posts.concat(createPost)
        }
      });
    }
  });

  if (queryLoading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <button
        onClick={() =>
          createPost({
            variables: {
              post: newPost
            },
            optimisticResponse: {
              __typename: 'Mutation',
              createPost: {
                id: 'n/a',
                __typename: 'Post',
                title: newPost.title + ' (placeholder)',
                body: newPost.body + ' (placeholder)'
              }
            }
          })
        }
      >
        Create post {mutationLoading ? '(loading)' : ''}
      </button>
      <ul>
        {data.posts.map(post => (
          <li key={post.id}>
            <p>
              <label>{post.id}</label> <strong>{post.title}</strong>
            </p>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Posts;
