//Javascript per index.html (SchermataIniziale)

//Nasconde le funzioni del proprietario se non autenticato
function hiddenButton(flag) {
    var setVisibility = "none"
    if (!flag) setVisibility = "initial"

    var arrayBottoni = document.getElementsByName("BottoniProprietario")
    for (e of arrayBottoni) e.style.display = setVisibility
    console.log("hiddenButton pressed")
    return true
}

//Controlla inserimento date Check-in e Check-out
function dataControl() {

    var dataFrom = document.getElementById("dateFrom")
    var dataTo = document.getElementById("dateTo")

    if (dataFrom.value > dataTo.value) dataTo.value = null
}