describe('blog app',() => {
  beforeEach(() => {
    cy.request('POST','http://localhost:3000/api/testing/reset')
  })
  it('displays login form by default',() => {
    cy.visit('http://localhost:3000')    
    cy.get('form')
    .and('contain','Login')
    .should('contain','Username')
    .should('contain','Password')
    cy.get('form input')
    .should('have.length',2)
    cy.get('form button')
    .contains('Login')
  })
  describe('user login',() => {
    beforeEach(() => {
      const user = {
        name: 'testname',
        username: 'testusername',
        password: 'testpassword',
        blogs: []
      }
      cy.request('POST','http://localhost:3000/api/users',user)
      cy.visit('http://localhost:3000')
    })
  
    it('can open front page',() => {
      cy.contains('Login')
    })
  
    it('can login',() => {
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()
      cy.contains('testname logged in')
    })
  
    it('cannot login with invalid username',() => {
      cy.get('#username').type('wrongusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()
      cy.get('html').should('not.contain','logged in')
    })
  
    it('cannot login with wrong password',() => {
      cy.get('#username').type('testusername')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('html').should('not.contain','logged in')
    })
  
    it('red notification with invalid login',() => {
      cy.get('#username').type('testusername')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('#notification')
      .should('have.css','color','rgb(255, 0, 0)')
    }) 
  })
  describe('while user logged in',() => {
    beforeEach(() => {
      const user = {
        name: 'testname',
        username: 'testusername',
        password: 'testpassword',
        blogs: []
      }
      cy.request('POST','http://localhost:3000/api/users',user)
      cy.visit('http://localhost:3000')
      cy.get('#username').type('testusername')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()    
    })
    it('create new blog',() => {
      cy.get('#createnewblog').click()
      cy.get('#title').type('new blog title')
      cy.get('#author').type('new blog author')
      cy.get('#url').type('new blog url')
      cy.get('#addnewblog').click()
      cy.get('html')
      .should('contain','new blog title')
      .should('contain','new blog author')
    })
  })
})



