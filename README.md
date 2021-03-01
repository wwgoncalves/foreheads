<h1 align="center">
  <img alt="Foreheads" title="Logo" src="public/logo.png" width="150px" /> <br />
  foreheads
</h1>

> :closed_lock_with_key::busts_in_silhouette::speech_balloon: Foreheads é uma solução experimental para comunicação em tempo real, segura e de ponta-a-ponta entre duas pessoas.

<p align="justify">Simultaneamente, a aplicação permite realizar uma videochamada, trocar mensagens de texto e transferir arquivos de qualquer tamanho de maneira privada<sup>*</sup>, de navegador para navegador, através da tecnologia <a href="https://webrtc.org/">WebRTC</a>. Em seu desenvolvimento, as bibliotecas <a href="https://reactjs.org/">React</a>, <a href="https://material-ui.com/">Material-UI</a> e <a href="https://styled-components.com/">styled-components</a> foram utilizadas.</p>

---

## Screenshots

<h2 align="center">
  <img alt="Screenshot" title="Interface web no navegador" src="screenshots/browser1.png" width="400px" /> <img alt="Screenshot" title="Interface mobile" src="screenshots/mobile1.png" width="200px" /> <br /> <img alt="Screenshot" title="Interface web no navegador" src="screenshots/browser2.png" width="400px" /> <img alt="Screenshot" title="Interface mobile" src="screenshots/mobile2.png" width="200px" /> <br /> <img alt="Screenshot" title="Interface web no navegador" src="screenshots/browser3.png" width="400px" />
</h2>

---

## Demonstração e Uso do Código

A partir [desse endereço](https://foreheads-af123.web.app/), você e outra pessoa podem testar a aplicação. Vocês terão total privacidade na comunicação de voz, vídeo, texto e arquivos.

_A UI está em inglês para facilitar o uso de qualquer interessado. A aplicação foi testada principalmente nos navegadores Chrome (para Linux e Android). Para dificuldades que precisar de ajuda, fique à vontade para usar a seção de issues deste repositório._

A tecnologia WebRTC, recentemente estável e em melhoria contínua, permite o desenvolvimento de soluções muito interessantes que usam voz e imagem, e comunicação em tempo real entre os navegadores/clientes. Sinta-se livre para utilizar e estender o código deste repositório, bem como implantar esta solução em um espaço próprio.

---

> <sup>\*</sup>_A privacidade é inerente à tecnologia WebRTC desde que não existam servidores intermediários. Esta solução não utiliza servidores TURN e, além da hospedagem, apenas utiliza um serviço terceiro &mdash; da plataforma [Firebase](https://firebase.google.com/) da Google &mdash; inicialmente como mecanismo de "sinalização" entre os pares, antes da comunicação real, para permitir que as duas pessoas conheçam seus endereços IP e estabeleçam uma conexão entre si. A partir daí, a comunicação ocorrerá totalmente de modo privado, de ponta a ponta._

_A arte original do logotipo, ícone e favicon usados pela aplicação foi feita por <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> e obtida em <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>_
