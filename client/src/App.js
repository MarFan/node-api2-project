import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Container, Grid, Header, Item, Comment, Form, Button } from 'semantic-ui-react';


const initFormValues = {post_id: null, text: ''};

function App() {
  const [postList, setPostList] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [postComments, setPostComments] = useState([]);
  const [commentForm, setCommentForm] = useState(initFormValues);
  useEffect(() => {
    // get my blog posts
    axios.get('//localhost:4000/api/posts')
      .then(res => setPostList(res.data))
      .catch(err => console.log(err))
  },[])

  const getComments = (id) => {
    setSelectedPost(postList.find(post => post.id === id ))
    setCommentForm({...commentForm, post_id: id});
    axios.get(`//localhost:4000/api/posts/${id}/comments`)
      .then(res => setPostComments(res.data))
      .catch(err => {console.log(err); setPostComments([])})
  }

  const handleChange = e => {
    setCommentForm({
        ...commentForm,
        [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(`//localhost:4000/api/posts/${commentForm.post_id}/comments`, commentForm)
      .then(res => {
        getComments(commentForm.post_id);
        setCommentForm(initFormValues);
      })
      .catch(err => console.log(err))
  }

  return (
    <Container>
      <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column>
              <Header as='h2'>Recent Posts</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {/* Blog Posts */}
            <Item.Group>
            {
              postList.map(post => (
                <Item key={post.id}>
                  <Item.Content>
                    <Item.Header as='a' onClick={() => getComments(post.id)}>{post.title}</Item.Header>
                    <Item.Meta>{post.contents}</Item.Meta>
                  </Item.Content>
                </Item>
              ))
            }
            </Item.Group>
          </Grid.Column>
          <Grid.Column>
            {/* Post Comments */}
            {
              postComments.length > 0 && <Header as='h4'>Comments</Header>
            }
            <Comment.Group>
            {
              
              postComments.map(comment => (
                <Comment key={comment.id}>
                  <Comment.Content>
                    <Comment.Author as='a'>User</Comment.Author>
                    <Comment.Metadata><div>{comment.created_at}</div></Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                  </Comment.Content>
                </Comment>
              ))
            }
            </Comment.Group>
          </Grid.Column>
          <Grid.Column>
            {/* Comment Form */}
            {
              Object.keys(selectedPost).length !== 0 && (
                <Form onSubmit={handleSubmit}>
                  <Form.TextArea name="text" value={commentForm.text} onChange={handleChange} label="Your Comment" placeholder="Share your wisdom..." />
                  <Button type="submit">Comment</Button>
                </Form>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
