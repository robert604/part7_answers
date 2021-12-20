import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render,fireEvent} from '@testing-library/react'
import {prettyDOM} from '@testing-library/dom'
import {Blog,AddBlog} from '../components/comps'

let blog
beforeEach(()=>{
  blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 100,
    user: {
      name: 'user name'
    }
  }
})

test('only title and author shown for blog by default',()=>{
  const comp = render(
    <Blog params={{blog}}/>
  )

  expect(comp.container).toHaveTextContent('blog title')
  expect(comp.container).toHaveTextContent('blog author')
  expect(comp.getByText('blog title',{exact:false})).toBeVisible()
  expect(comp.getByText('blog author',{exact:false})).toBeVisible()  
  expect(comp.getByText('blog url')).not.toBeVisible()
  expect(comp.getByText('likes 100')).not.toBeVisible()
  
})

test('url and likes also shown when button clicked',()=>{
  const comp = render(
    <Blog params={{blog}}/>
  )
  const button = comp.getByText('view')
  fireEvent.click(button)
  expect(comp.getByText('blog url')).toBeVisible()
  expect(comp.getByText('likes 100')).toBeVisible()
})

test('2 clicks of like button results in 2 calls to handler',()=>{
  const likeIt = jest.fn()
  const comp = render(
    <Blog params={{blog,likeIt}}/>
  )
  const likeButton = comp.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)
  expect(likeIt.mock.calls).toHaveLength(2)
})

test('add blog form handler gets correct fields when clicked',() => {
  const mockHandler = jest.fn()
  const addBlogComp = render(
    <AddBlog params={{addBlogClick:mockHandler}}/>
  )
  const title = addBlogComp.container.querySelector('#title')
  fireEvent.change(title,{ target:{value:'new title'} })  
  const author = addBlogComp.container.querySelector('#author')
  fireEvent.change(author,{ target:{value:'new author'} })
  const url = addBlogComp.container.querySelector('#url')
  fireEvent.change(url,{ target:{value:'new url'}})
  const addBlogForm = addBlogComp.container.querySelector('#addBlogForm')
  //console.log(prettyDOM(title))
  fireEvent.submit(addBlogForm)
  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].newBlogInfo.title).toBe('new title')
  expect(mockHandler.mock.calls[0][0].newBlogInfo.author).toBe('new author')
  expect(mockHandler.mock.calls[0][0].newBlogInfo.url).toBe('new url')
})