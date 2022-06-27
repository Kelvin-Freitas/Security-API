function Home(){
    return (
        <div>
            <h3>Entrar</h3>
            <span for="txtUsername">Usuário</span>
            <input type="text" name="txtUsername" id="txtUsername"/>
            <span for="txtPass">Senha</span>
            <input type="password" name="txtPass" id="txtPass"/>
        </div>
    )
}

export default Home