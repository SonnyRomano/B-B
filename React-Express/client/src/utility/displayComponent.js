// Mostra o nasconde tramite il parametro flag i componenti che hanno
// componentName impostato come id

export default function displayComponent(componentName, flag) {
    if (document.getElementById(componentName) == null) return;
    if (flag) document.getElementById(componentName).style.display = 'block';
    else document.getElementById(componentName).style.display = 'none';
}