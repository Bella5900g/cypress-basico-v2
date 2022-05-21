/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function(){
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', function(){
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'

        cy.get('#firstName')
            .type('Isabella')
            .should('have.value', 'Isabella')
        cy.get('#lastName')
            .type('Vieira')
            .should('have.value', 'Vieira')
        cy.get('#email')
            .type('bellacandy5900g@gmail.com')
            .should('have.value', 'bellacandy5900g@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0})
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName')
            .type('Isabella')
            .should('have.value', 'Isabella')
        cy.get('#lastName')
            .type('Vieira')
            .should('have.value', 'Vieira')
        cy.get('#email')
            .type('bellacandy5900g@gmail,com')
            .should('have.value', 'bellacandy5900g@gmail,com')
        cy.get('#open-text-area').type('Teste, Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('Campo telefone continua vazio quando preenchido com valor não-numérico', function(){
        cy.get('#phone')
            .type('abcdifthr')
            .should('have.value', '')
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName')
            .type('Isabella')
            .should('have.value', 'Isabella')
        cy.get('#lastName')
            .type('Vieira')
            .should('have.value', 'Vieira')
        cy.get('#email')
            .type('bellacandy5900g@gmail.com')
            .should('have.value', 'bellacandy5900g@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste, Teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Isabella')
            .should('have.value', 'Isabella')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Vieira')
            .should('have.value', 'Vieira')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('bellacandy5900g@gmail.com')
            .should('have.value', 'bellacandy5900g@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('27993093237')
            .should('have.value', '27993093237')
            .clear()
            .should('have.value', '')
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obriatórios', function(){
        //Usando o comdando cy.contains
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Envia o formulário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('Seleciona um produto (YouTube) por seu texto', function(){
        //Usando o comando .select para campos de seleção suspensa
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('Seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('Seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('Marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('Marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio){
              cy.wrap($radio).check()
              cy.wrap($radio).should('be.checked')
          })
    })

    it('Marca amos checboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('Seleciona um arquivo da pasta fixtures', function(){
        //Fazendo Upload de Arquivos com Cypress
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Seleciona um arquivo utilizando um fixture para a qual foi dada um alias', function(){
        //Utilizando o comando cy;fixture para upload de arquivo com o cypress
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('Acessa a página da política de prividade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })
  })
  