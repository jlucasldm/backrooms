# Visitando uma Maquete Virtual - The Backrooms

## Contexto

Este projeto foi desenvolvido para a disciplina de Computação Gráfica do curso de Ciência da Computação da Universidade Federal da Bahia (UFBA). O objetivo do projeto é construir uma aplicação em [Three.JS](https://threejs.org/) que permita simular um passeio por uma **Maquete Virtual**. A maquete utilizada foi um modelo de um conto popular de terror da internet, The Backrooms. 

The Backrooms seriam corredores largos e vazios  cuja arquitetura, iluminação e demais características causariam estranheza. As histórias em torno dos Backrooms mudam de narrador a narrador. Este trabalho se baseia no conto ambientado em torno de uma criatura e uma exploração científica. Os modelos escolhidos para a maquete e personagens, assim como controle de iluminação, levaram em consideração esse contexto. 

De acordo com a especificação do projeto, foram fornecidas ao usuário 3 modalidades de percurso:

1. **Modo Visita Interna**: O usuário poderá andar pela maquete, visitando seu interior, como uma pessoa o faria em um modelo real;

2. **Modo Visita Externa**: Nesse modo o usuário pode "voar como um drone" no lado externo da maquete virtual. É possível selecionar distintos planos de corte para visualizar o interior da maquete;

3. **Modo Visita Guiada**: 3 pontos de interesse foram definidos na maquete, onde o usuário é "transportado" para o local podendo apenas observar o ambiente ao seu redor, sem possibilidade de deslocamento.

## Modelos

Neste projeto foram utilizados 3 modelos 3D, sendo eles:

1. **Backrooms**: Modelo da maquete virtual, contendo os corredores e salas que compõem o cenário. O modelo foi encontrado no site SketchFab[^1] e importado como .gltf.

2. **Cientista**: Modelo do personagem que o usuário encontra durante a visita guiada. O modelo foi encontrado no site SketchFab[^2]. Duas instâncias desse modelo foram implementadas, dando ao usuário a noção de escala do cenário. Para animar os modelos, foi usado o site Mixamo[^4], onde adicionei uma animação aos respectivos cientistas. Após o processo de animação, o modelo foi exportado como .fbx e importado no projeto.

3. **Coisa**: Modelo da criatura que o usuário encontra durante a visita interna. O modelo foi encontrado no site SketchFab[^3] e importado como .gltf. Uma instância desse modelo foi importada, propositalmente maior que os demais modelos para garantir a impressão de estranheza e imponência da criatura.

## Câmeras e Controles de Movimento

Foram utilizadas 5 câmeras, sendo elas:

1. **Câmera Interna (1)**: Câmera que o usuário controla durante a visita interna. A câmera é posicionada na altura do personagem, e o usuário pode movimentá-la utilizando o mouse e a barra de espaço. 

* Barra de espaço: libera a movimentação do personagem e da câmera. Pressione novamente para travar a movimentação. Caso o comportamento não seja o esperado, clique na cena para garantir que o foco está na aplicação.
* Movimento do mouse: movimenta a câmera.
* Botão esquerdo do mouse: movimenta o personagem para frente.
* Botão direito do mouse: movimenta o personagem para trás.

Foi utilizado o controle de movimento FirstPersonControls, disponível no Three.JS, para controlar a câmera interna. O controle foi customizado para que a movimentação seja mais lenta e suave. O personagem pode atravessar paredes, mas está limitado ao espaço da maquete.

2. **Câmera Externa (1)**: Câmera que o usuário controla durante a visita externa. A câmera é posicionada acima da maquete, e o usuário pode movimentá-la utilizando o mouse. A câmera orbita naturalmente em torno da maquete, e o usuário pode controlar a distância da câmera utilizando a roda do mouse.

* Botão esquerdo do mouse: movimenta a orientação da maquete.
* Botão direito do mouse: movimenta a posição da câmera no espaço.
* Roda do mouse: controla a distância da câmera em relação à maquete.

Foi utilizado o controle de movimento OrbitControls, disponível no Three.JS, para controlar a câmera externa. O controle foi customizado para que a movimentação seja mais lenta e suave. A câmera pode atravessar paredes.

3. **Câmera Guiada (3)**: Câmeras escolhidas em três pontos fixos da maquete onde o usuário pode ser transportado durante a visita guiada. Não há possibilidade de movimento de câmera ou de movimentação.

Foi utilizado o controle FlyControls, disponível no Three.JS, para controlar a câmera guiada.

## Iluminação
Duas abordagens diferentes foram adotadas para a iluminação da maquete, de acordo com o modo de visualização escolhido pelo usuário.

1. **Visita Interna e Visita Guiada**: Pontos de luz distintos foram posicionados na maquete simulando os pontos de luz dos corredores. Foi utilizado PointLight, disponível no Three.JS, para criar os pontos de luz. A intensidade da luz foi reduzida para que o usuário tenha a sensação de que está em um ambiente escuro e intimidador.

2. **Visita Externa**: Foi utilizado DirectionalLight, disponível no Three.JS, para criar uma luz direcional que ilumina a maquete como um todo. O ponto de luz foi colocado acima da maquete, simulando a luz do sol. Além disso, foi utilizado o AmbientLight, disponível no Three.JS, para criar uma luz ambiente que ilumina a maquete como um todo. O uso de ambas as luzes garantes uma visibilidade mais apropriada do modelo no modo de visita externa.

## Planos de Corte
Foram utilizados 3 planos de corte, sendo eles:

1. **Plano de Corte YZ**: Plano de corte que permite visualizar o interior da maquete na direção do eixo X. O plano de corte é posicionado no centro da maquete, e o usuário pode movimentá-lo utilizando os controladores do GUI.

2. **Plano de Corte XZ**: Plano de corte que permite visualizar o interior da maquete na direção do eixo Y. O plano de corte é posicionado na base da maquete, e o usuário pode movimentá-lo utilizando os controladores do GUI.

3. **Plano de Corte XY**: Plano de corte que permite visualizar o interior da maquete na direção do eixo Z. O plano de corte é posicionado na base da maquete, e o usuário pode movimentá-lo utilizando os controladores do GUI.

## Controles GUI
Foram utilizados 5 controladores GUI, sendo eles:

1. **Controlador de Modo (tipoVisita)**: Controlador que permite ao usuário escolher o modo de visualização da maquete. O usuário pode escolher entre os modos de visita interna, visita externa e visita guiada.

2. **Controlador de Câmera da Visita Guiada (visitaGuiadaCamera)**: Controlador que permite ao usuário escolher a câmera que será utilizada na visita guiada. O usuário pode escolher entre as câmeras guiadas 1, 2 e 3.

3. **Controlador de Plano de Corte (cortePlano)**: Controlador que permite ao usuário escolher o plano de corte que será utilizado na visita externa. O usuário pode escolher entre os planos de corte YZ, XZ e XY.

4. **Controlador de Posição do Plano de Corte**: Controlador que permite ao usuário escolher a posição do plano de corte que será utilizado na visita externa. O usuário pode escolher a posição do plano de corte utilizando valores entre -17.0 e 17.0.

5. **Controlador de Rotação Automática da Visita Externa**: Controlador que permite ao usuário escolher se a câmera externa irá rotacionar automaticamente em torno da maquete. O usuário pode escolher entre os valores true e false.

## Execução
Para executar o projeto, basta abrir o arquivo `index.html` em um navegador web utilizando um servidor local. O projeto foi testado nos navegadores Mozilla Firefox e Microsoft Edge.

## Referências
[1]"BackRooms" (https://skfb.ly/otQY7) by Huuxloc is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

[2]"Hazmat (SCP Containment Breach)" (https://skfb.ly/ooV68) by SCP Games is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

[3]"Bacteria Backrooms" (https://skfb.ly/o9xsN) by PipotGZ is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).