// lembrete: As imagems estão em inglês, portanto os naipes são. C = Paus, D = Ouros, H = Copas, S = Espadas

var pontos = 100;
document.getElementById('fichas').innerText = pontos

var btnreiniciar =  document.getElementById('reiniciar')

var maoDealer = 0;
var maoJogador = 0;

var DealerAceCount = 0;
var JogadorAceCount = 0;

var cartasdealer = document.getElementById('cartas-dealer')
var cartasjogador = document.getElementById('cartas-jogador')

var rangeAposta = document.getElementById('rangeaposta')
var valorAposta = document.getElementById('valoraposta')
valorAposta.innerText = rangeAposta.value
rangeAposta.max = pontos

var hidden
var deck

var podeAumentar = true
var podeFicar = true
var podeApostar = true

//executa essas funções ao carregar a página
window.onload = function iniciar(){
    maoDealer = 0;
    maoJogador = 0;

    DealerAceCount = 0;
    JogadorAceCount = 0;

    hidden
    deck
    buildDeck();
    embaralharDeck();
    iniciarJogo();
}

// criar uma array do deck de cartas de todos os naipes com cada valor
function buildDeck(){
    let valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', ]
    let naipes = ['C', 'D', 'H', 'S']
    deck =[]

    for (let i = 0; i < naipes.length; i++){
        for (let j = 0; j < valores.length; j++){
            deck.push(valores[j] + "-" + naipes[i])
        }
    }
}

// esse embaralhamento faz o seguinte, para cada carta do deck (de 52 cartas), ele seleciona uma nova posição na array para ele
function embaralharDeck(){
    for (let i = 0; i < deck.length; i++){
        // este math.floor serve para limitar o embaralhamento até a penultima carta, porque a ultima carta ficaria com a posição que sobra-se
        let j = Math.floor(Math.random() * deck.length)
        // aqui serve para substituir o a array do deck de cartas para a array do deck embaralhada
        let aux = deck[i]
        deck[i] = deck[j]
        deck[j] = aux
    }
    console.log(deck)
}

function iniciarJogo(){
    //isso faz com que a carta escondida do dealer seja removida da array do deck (para ela n se repetir), e armazena o valor dessa carta
    hidden = deck.pop()
    maoDealer += getValue(hidden)
    DealerAceCount += checkAce(hidden)

    while (maoDealer < 17){
        let cartaImg = document.createElement('img')
        let carta = deck.pop();
        cartaImg.src = './cartas/' + carta + '.png'
        maoDealer += getValue(carta)
        DealerAceCount += checkAce(carta)
        document.getElementById('cartas-dealer').append(cartaImg)
    }

    for (let i = 0; i < 2; i++){
        let cartaImg = document.createElement('img')
        let carta = deck.pop();
        cartaImg.src = './cartas/' + carta + '.png'
        maoJogador += getValue(carta)
        DealerAceCount += checkAce(carta)
        document.getElementById('cartas-jogador').append(cartaImg)
    }

    document.getElementById('aumentar').addEventListener('click', aumentar)
    document.getElementById('ficar').addEventListener('click', ficar)
    document.getElementById('apostar').addEventListener('click', apostar)
    document.getElementById('reiniciar').addEventListener('click',reiniciar)

}

//faz com que uma carta seja retirada do deck total de cartas, e atribui o valor da carta retirada para a mão do jogador
function aumentar(){
    if (!podeAumentar){
        return;
    }

    let cartaImg = document.createElement('img')
    let carta = deck.pop();
    cartaImg.src = './cartas/' + carta + '.png'
    maoJogador += getValue(carta)
    DealerAceCount += checkAce(carta)
    document.getElementById('cartas-jogador').append(cartaImg)

    if (reduceAce(maoJogador, JogadorAceCount) > 21){
        podeAumentar = false
        podeApostar = false
        rangeAposta.disabled = true
    }

}

// revela a carta escondida do dealer e faz as verificaçõees de vitória e derrota
function ficar(){
    if (!podeFicar){
        return;
    }
    maoDealer = reduceAce(maoDealer, DealerAceCount)
    maoJogador = reduceAce(maoJogador, JogadorAceCount)

    btnreiniciar.style.display = 'inline'

    podeAumentar = false
    document.getElementById('hidden').src = './cartas/' + hidden + '.png';

    var numeroAposta = parseInt(rangeAposta.value)

    let mensagem = ''
    if (maoJogador > 21){
        mensagem = 'Você perdeu!'
        pontos -= numeroAposta
        document.getElementById('fichas').innerText = pontos
        podeFicar = false
        rangeAposta.value = 1
    }
    else if (maoDealer > 21){
        mensagem = 'Você ganhou!'
        pontos += numeroAposta
        document.getElementById('fichas').innerText = pontos
        podeFicar = false
    }
    else if (maoJogador == maoDealer){
        mensagem = 'Empate'
        podeFicar = false
    }
    else if (maoJogador > maoDealer){
        mensagem = 'Você ganhou!'
        pontos += numeroAposta
        document.getElementById('fichas').innerText = pontos
        podeFicar = false
    }
    else if (maoJogador < maoDealer){
        mensagem = 'Você perdeu!'
        pontos -= numeroAposta
        document.getElementById('fichas').innerText = pontos
        podeFicar = false
        rangeAposta.value = 1
    }

    document.getElementById('mao-dealer').innerText = maoDealer
    document.getElementById('mao-jogador').innerText = maoJogador
    document.getElementById('resultado').innerText = mensagem
}

//reinicia a página
function reiniciar(){
    // window.location.reload();
    document.getElementById('hidden').src = "./cartas/BACK.png";
    btnreiniciar.style.display = 'none'
    document.getElementById('resultado').innerText = ''

    podeAumentar = true
    podeFicar = true
    podeApostar = true
    rangeAposta.disabled = false

    while (cartasdealer.children.length > 1) {
        cartasdealer.removeChild(cartasdealer.lastChild);
      }

    while (cartasjogador.firstChild) {
        cartasjogador.removeChild(cartasjogador.firstChild);
      }

    maoDealer = 0;
    maoJogador = 0;
    document.getElementById('mao-dealer').innerText = maoDealer
    document.getElementById('mao-jogador').innerText = maoJogador

    DealerAceCount = 0;
    JogadorAceCount = 0;

    hidden
    deck

    buildDeck();
    embaralharDeck();
    iniciarJogo();
} 

// isso é um pouco complicado. O nome dos arquivos das cartas é por exemplo '4-C', e o split faz com que o valor que data armazena seja dividido por exemplo ['4', 'C']
function getValue(carta){
    let data = carta.split('-')
    let valor = data[0]

    //aqui ele checa se o valor armazenado não tem número, então ela pode ser um A (que vale 11 pontos), ou um J,Q,K que vale 10, caso seja um número ele armazena o valor do próprio numero
    if (isNaN(valor)){
        if (valor == 'A'){
            return 11
        }
        return 10;
    }
    return parseInt(valor)
}

//se a primeira coisa da string for A, retorna 1 no valor
function checkAce(carta){
    if (carta[0] =='A'){
        return 1;
    }
    return 0;
}

// function reduceAce(somaJogador, suaAceCount){
//     while (somaJogador > 21 && suaAceCount > 0){
//         somaJogador -= 10;
//         suaAceCount -= 1
//     }
//     return somaJogador

// }

function reduceAce(maoJogador, JogadorAceCount){
    while (maoJogador > 21 && JogadorAceCount > 0){
        maoJogador -= 10;
        JogadorAceCount -= 1
    }
    return maoJogador

}

rangeAposta.oninput = function() {
    valorAposta.innerText = this.value;
    rangeAposta.max = pontos
  }

function apostar(){
    if (!podeApostar){
        return;
    }
    if (rangeAposta.style.display === 'none'){
        rangeAposta.style.display = 'inline'
        valorAposta.style.display = 'inline'
    } else{
        rangeAposta.style.display = 'none'
        valorAposta.style.display = 'none'
    }
}