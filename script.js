// Variáveis do jogo
let vitorias = 0;
let recorde = 0;
let rodadaAtual = 0;
let dicasDisponiveis = 3;
let pulosDisponiveis = 1;
let portaMonstro;
let jogoAtivo = false;

// Elementos do DOM
const botaoJogar = document.getElementById('botaoJogar');
const gameContainer = document.getElementById('gameContainer');
const contadorElement = document.getElementById('contador');
const recordeElement = document.getElementById('recorde');
const mensagemElement = document.getElementById('mensagem');
const dicaBtn = document.getElementById('dicaBtn');
const pularBtn = document.getElementById('pularBtn');

// Inicialização das partículas
function initParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 150,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#00f7ff", "#ff00f7", "#f7ff00"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.7,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#533483",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });
}

// Função para voltar à tela inicial
function voltarParaTelaInicial() {
    // Resetar variáveis (exceto recorde)
    vitorias = 0;
    rodadaAtual = 0;
    dicasDisponiveis = 3;
    pulosDisponiveis = 1;
    jogoAtivo = false;
    
    // Limpar o container do jogo
    gameContainer.innerHTML = '';
    
    // Atualizar a UI
    contadorElement.textContent = '0';
    mensagemElement.textContent = '';
    
    // Mostrar o botão de iniciar
    botaoJogar.style.display = 'block';
    botaoJogar.textContent = 'JOGAR NOVAMENTE';
    
    // Resetar power-ups
    dicaBtn.disabled = true;
    pularBtn.disabled = true;
    dicaBtn.innerHTML = 'DICA (3)';
    pularBtn.innerHTML = 'PULAR (1)';
}

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // Verificar recorde salvo
    const recordeSalvo = localStorage.getItem('recordePortalMystery');
    if (recordeSalvo) {
        recorde = parseInt(recordeSalvo);
        recordeElement.textContent = recorde;
    }
    
    // Configurar eventos
    botaoJogar.addEventListener('click', iniciarJogo);
    dicaBtn.addEventListener('click', usarDica);
    pularBtn.addEventListener('click', pularRodada);
});

function iniciarJogo() {
    jogoAtivo = true;
    botaoJogar.style.display = 'none';
    vitorias = 0;
    rodadaAtual = 0;
    dicasDisponiveis = 3;
    pulosDisponiveis = 1;
    
    contadorElement.textContent = '0';
    mensagemElement.textContent = '';
    
    proximaRodada();
}

function proximaRodada() {
    if (!jogoAtivo) return;
    
    rodadaAtual++;
    mensagemElement.textContent = `Rodada ${rodadaAtual} - Escolha um portal`;
    
    // Gerar nova porta do monstro (1 a 5)
    portaMonstro = Math.floor(Math.random() * 5) + 1;
    
    // Criar portas (3 a 5 portas baseado na rodada)
    const numPortas = Math.min(3 + Math.floor(rodadaAtual / 3), 5);
    criarPortas(numPortas);
    
    // Atualizar power-ups
    dicaBtn.disabled = dicasDisponiveis <= 0;
    pularBtn.disabled = pulosDisponiveis <= 0;
    
    dicaBtn.innerHTML = `DICA (${dicasDisponiveis})`;
    pularBtn.innerHTML = `PULAR (${pulosDisponiveis})`;
}

function criarPortas(quantidade) {
    gameContainer.innerHTML = '<div class="portas" id="portasContainer"></div>';
    const portasContainer = document.getElementById('portasContainer');
    
    for (let i = 1; i <= quantidade; i++) {
        const porta = document.createElement('div');
        porta.className = 'porta';
        porta.dataset.numero = i;
        porta.textContent = i;
        
        // Efeito de aparecimento sequencial
        porta.style.animationDelay = `${i * 0.1}s`;
        porta.classList.add('appear');
        
        porta.addEventListener('click', () => escolherPorta(i));
        portasContainer.appendChild(porta);
    }
}

function escolherPorta(escolhaJogador) {
    if (!jogoAtivo) return;
    
    const portas = document.querySelectorAll('.porta');
    portas.forEach(porta => {
        const numeroPorta = parseInt(porta.dataset.numero);
        
        if (numeroPorta === portaMonstro) {
            porta.classList.add('revelada');
            setTimeout(() => {
                porta.textContent = '';
                porta.innerHTML = '<div class="alien">👾</div>';
            }, 300);
        } else if (numeroPorta === escolhaJogador) {
            porta.classList.add('passou');
        }
        
        porta.style.pointerEvents = 'none';
    });
    
    if (escolhaJogador === portaMonstro) {
        // Perdeu
        mensagemElement.innerHTML = `<span style="color: #ff0000">ALIEN ENCONTRADO!</span> Missão falhou na rodada ${rodadaAtual}`;
        jogoAtivo = false;
        
        // Atualizar recorde se necessário
        if (vitorias > recorde) {
            recorde = vitorias;
            recordeElement.textContent = recorde;
            localStorage.setItem('recordePortalMystery', recorde);
            mensagemElement.innerHTML += `<br><span style="color: var(--accent)">NOVO RECORDE: ${recorde}</span>`;
        }
        
        setTimeout(voltarParaTelaInicial, 2000);
    } else {
        // Passou
        vitorias++;
        contadorElement.textContent = vitorias;
        mensagemElement.innerHTML = `<span style="color: #00ff00">PORTAL SEGURO!</span> O alien estava no portal ${portaMonstro}`;
        
        // Chance de ganhar power-up
        if (Math.random() < 0.3) {
            if (Math.random() < 0.5 && dicasDisponiveis < 5) {
                dicasDisponiveis++;
                mostrarMensagemPowerUp('+1 DICA');
            } else if (pulosDisponiveis < 3) {
                pulosDisponiveis++;
                mostrarMensagemPowerUp('+1 PULO');
            }
        }
        
        setTimeout(proximaRodada, 2000);
    }
}

function usarDica() {
    if (dicasDisponiveis <= 0 || !jogoAtivo) return;
    
    dicasDisponiveis--;
    dicaBtn.innerHTML = `DICA (${dicasDisponiveis})`;
    dicaBtn.disabled = dicasDisponiveis <= 0;
    
    // Revela uma porta que não é a do monstro
    const portas = document.querySelectorAll('.porta:not(.revelada)');
    const portasSeguras = Array.from(portas).filter(p => parseInt(p.dataset.numero) !== portaMonstro);
    
    if (portasSeguras.length > 0) {
        const randomIndex = Math.floor(Math.random() * portasSeguras.length);
        const portaDica = portasSeguras[randomIndex];
        
        portaDica.classList.add('dica');
        portaDica.innerHTML = '<div class="safe">✓</div>';
        portaDica.style.pointerEvents = 'none';
        
        // Remove a dica após 1 segundo
        setTimeout(() => {
            portaDica.classList.remove('dica');
            portaDica.innerHTML = portaDica.dataset.numero;
            portaDica.style.pointerEvents = 'auto';
        }, 1000);
    }
}

function pularRodada() {
    if (pulosDisponiveis <= 0 || !jogoAtivo) return;
    
    pulosDisponiveis--;
    pularBtn.innerHTML = `PULAR (${pulosDisponiveis})`;
    pularBtn.disabled = pulosDisponiveis <= 0;
    
    mensagemElement.innerHTML = `<span style="color: var(--accent)">RODADA PULADA!</span> Preparando próximo portal...`;
    gameContainer.innerHTML = '';
    
    setTimeout(proximaRodada, 1500);
}

function mostrarMensagemPowerUp(mensagem) {
    const powerUpMsg = document.createElement('div');
    powerUpMsg.className = 'powerup-message';
    powerUpMsg.textContent = mensagem;
    document.body.appendChild(powerUpMsg);
    
    setTimeout(() => {
        powerUpMsg.style.animation = 'fadeOutUp 1s forwards';
        setTimeout(() => powerUpMsg.remove(), 1000);
    }, 500);
}