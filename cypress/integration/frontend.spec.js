describe('blog app',() => {
  beforeEach(() => {
    cy.request('POST','http://localhost:3000/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  it('displays login form by default',() => {
    cy.get('form')
    .and('contain','Login')
    .should('contain','Username')
    .should('contain','Password')
    cy.get('form input')
    .should('have.length',2)
    cy.get('form button')
    .contains('Login')

  })
})