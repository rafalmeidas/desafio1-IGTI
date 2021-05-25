//Função para facilitar a consulta com fetch
function fetchE(url) {
    return fetch(`https://api.covid19api.com/${url}`).then(res => res.json());
}

async function queryAPI() {
    await Promise.all([fetchE("summary"), fetchE("countries")])
        .then(([summary, countries]) => {
            //console.log(summary);
            populateIndicator(countries, summary);
        })

}
queryAPI();

function populateSummary(summary) {
    let [confirmed, death, recovered, active] = document.querySelectorAll("#confirmed, #death, #recovered, #active");

    let summaryG = summary.Global;
    let confirmados =
        console.log(summary.Global);

    confirmed.innerHTML = summaryG.NewConfirmed
}

function populateCountries(countries) {
    let combo = document.getElementById("combo");

    let options = countries.map((country) => {
        return `<option>${country.Country}</option>`;
    });

    return combo.innerHTML = options.join("");
}

function populateIndicator(countries, summary) {
    populateCountries(countries);
    populateSummary(summary);
}