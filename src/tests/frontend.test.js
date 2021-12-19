import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {Blog} from '../components/comps'

test('blog render',()=>{
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 100,
    user: {
      name: 'user name'
    }
  }
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