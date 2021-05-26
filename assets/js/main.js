const [confirmedE, deathE, recoveredE, activeE, comboE, todayE] = document.querySelectorAll("#confirmed, #death, #recovered, #active, #combo, #today");

///total/country/${country}

//Função para facilitar a consulta com fetch
function fetchE(url) {
    return fetch(`https://api.covid19api.com/${url}`).then(res => res.json());
}

async function queryAPI() {
    await Promise.all([fetchE("summary"), fetchE("countries")])
        .then(([summary, countries]) => {
            populateIndicator(countries, summary);
        })

}

queryAPI();

async function queryAPICountries(country) {
    await Promise.all([fetchE(`country/${country}`)])
        .then(countries => {
            return countries;
        });
}

function populateSummary(summary) {

    let summaryG = summary.Global;

    let confirmed = summaryG.TotalConfirmed;
    let death = summaryG.TotalDeaths;
    let recovered = summaryG.TotalRecovered;
    let active = confirmed - (death + recovered);

    confirmedE.innerHTML = formatNumber(confirmed);
    deathE.innerHTML = formatNumber(death);
    recoveredE.innerHTML = formatNumber(recovered);
    activeE.innerHTML = formatNumber(active);

    //Data
    todayE.value = formatDate(summaryG.Date);
}

function populateSummaryGlobal(countries) {

    countries.map((country) => {
        let optionT = document.createElement('option');
        optionT.text = country.Country;
        optionT.value = country.Slug;

        comboE.appendChild(optionT);
    });
}

function formatNumber(number) {
    return number.toLocaleString("pt-BR");
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function populateIndicator(countries, summary) {
    populateSummaryGlobal(countries);
    populateSummary(summary);
}

comboE.addEventListener("change", () => {
    queryAPICountries('thailand');
    console.log(val);
    todayE.value
});