// Funzione per controllare se l'utente ha permessi di accesso alla  
// pagina sulla quale viene chiamata.
// In caso non abbia i permessi, viene reindirizzato all'HomePage

export default function checkRoutingAccess(props) {
    let idProprietario = sessionStorage.getItem("id");
    let isHost = sessionStorage.getItem('isHost');
    if (idProprietario !== null && Number(isHost) === 1) console.log("Routing Possibile")
    else {
        console.log("Accesso Negato")
        props.history.push("/")
    }
}