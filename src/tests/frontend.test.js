import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render,fireEvent} from '@testing-library/react'
import {Blog} from '../components/comps'

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