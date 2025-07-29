const apiKeyInput = document.getElementById('apiKeyInput');
const gameselect = document.getElementById('gameselect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

// AIzaSyBmth0yoFhdTKZz7DG1ohsdtSNiryHvYf0
    const perguntarIA = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` 
    const pergunta = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuario com base no seu conhecimento do jogo, estrategias, builds e dicas

        ## Regras
        -Se você nao sabe a resposta, responda com 'Não sei' e nao tente inventar respostas.
        -se a pergunta nao esta relacionada ao jogo, responda com 'Essa pergunta nao esta relacionada ao jogo'
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que voce nao tenha certeza de que existe no patch atual.

        ## Resposta
        Economize na resposta, seja direto e responda no maximo 500 caracteres. Responda em markdown, não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuario esta querendo.
        
        ## Exemplo de resposta
        Pergunta do usuario: Melhor build rengar jungle
        Resposta: a build mais atual é: \n\n **Itens:** coloque os itens aqui. \n\n**Runas:**\n\nexemplo de runas\n\n

        ------

        Aqui esta a pergunta do usuario: ${question}
    
    `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]

    }]

    const tools = [{
        google_search: {}
    }]

    const response = await fetch(geminiURL, {
        method: 'POST' ,
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarformulario = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = gameselect.value;
    const question = questionInput.value;


    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Perguntando......"
    askButton.classList.add("loading...")

    try {
        const text = await perguntarIA(question, game, apiKey)
        aiResponse.querySelector('.Response-content').innerHTML = markdownToHTML(text);
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log("Error: ", error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarformulario);