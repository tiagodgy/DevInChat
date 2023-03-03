<div align="center">
<h1>DevInChat</h1>
</div>
<h3>DevInChat é um aplicativo web para conversas em tempo real. Trata-se de uma única sala para conversas anonimas entre usuários do mundo todo. O objetivo desse projeto foi colocar em prática diversos apredizados do curso DevInHouse do Senai/SC como a criação de APIs em C#, uso de RabbitMQ, React e testes. Além de outras habilidade que eram do meu interesse aprender como Docker e Websockets.</h3>
<br></br>
<div align="center">
<h3><a href="http://192.241.133.135:5173/">Clique aqui para testar!</a></h3>
<p>http://192.241.133.135:5173/</p>
</div>
<hr/>
<br></br>
<p>A aplicação é composta por 5 componentes. Primeiro a interface gráfica que foi desenvolvida em React JS, segundamente o AdminConsole uma aplicação console em .NET para moderação das menssagens. As outras 3 aplicações fazem parte do backend, sendo elas uma API, um Websocket desenvolvido com signalR e por fim uma aplicação que consome filas do RabbitMQ para salvar dados de forma assincrona no banco de dados SQL. Todos os componentes, execeto o admin console foram hospedados em uma maquina virtual utilizando docker.</p>
<div align="center">
<img src="https://github.com/tiagodgy/DevInChat/blob/main/OtherFiles/functions%20diagram.png" width="700">
</div>
<div align="center">
<img src="https://github.com/tiagodgy/DevInChat/blob/main/OtherFiles/databaseModel.png" width="700">
</div>
<br></br>
<div align="center">
<img src="https://github.com/tiagodgy/DevInChat/blob/main/OtherFiles/PrintFrontEnd.png" width="500">
</div>
<hr/>
<p>O único componente que não pode ser testado sem compilar o projeto é o AdminConsole, pois ele foi projetado para rodar localmente na máquina do administrador e receber assincronamente os "reports" da fila do rabbitMQ. Admin console funciona de maneira que na interface do usuário existe um botão de "report", ao clicar no botão é enviado uma "denuncia" para uma fila do rabbitMQ e assim que consumida pelo AdminConsole o administrador deve selecionar Y para aceitar ou N para rejeitar a denúncia. Ao aceitar a denúncia a mensagem é apadada do banco de dados.</p>
<div align="center">
<img src="https://github.com/tiagodgy/DevInChat/blob/main/OtherFiles/AdminConsoleExemple.png" width="700">
</div>
