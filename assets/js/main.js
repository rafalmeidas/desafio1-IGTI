const [confirmedE, deathE, recoveredE, activeE, comboE, todayE] = document.querySelectorAll("#confirmed, #death, #recovered, #active, #combo, #today");

window.addEventListener('load', () => {
    loadApplication();
})

//Função para facilitar a consulta com fetch
function fetchE(url) {
    return fetch(`https://api.covid19api.com/${url}`).then(res => res.json());
}

async function loadApplication() {
    await Promise.all([fetchE("summary"), fetchE("countries")])
        .then(([summary, countries]) => {
            populateInitialIndicator(countries, summary);
        })
}

function populateInitialIndicator(countries, summary) {
    populateComboCountries(countries);
    populateSummary(summary);
    todayE.value = formatDate(new Date());
}

const queryAPICountries = async (country) => {
    return await fetchE(`country/${country}`);
}

function populateSummary(summary) {

    let confirmed;
    let death;
    let recovered;
    let active;

    if (summary.Global) {
        let summaryG = summary.Global;
        confirmed = summaryG.TotalConfirmed;
        death = summaryG.TotalDeaths;
        recovered = summaryG.TotalRecovered;
        active = confirmed - (death + recovered);
    } else {
        confirmed = summary.Confirmed;
        death = summary.Deaths;
        recovered = summary.Recovered;
        active = confirmed - (death + recovered);
    }

    confirmedE.innerHTML = formatNumber(confirmed);
    deathE.innerHTML = formatNumber(death);
    recoveredE.innerHTML = formatNumber(recovered);
    activeE.innerHTML = formatNumber(active);
}

//melhorar calculo de ativos
function sumActive(confirmed, death, recovered) {
    if (death <= 0) {

    }
}
function populateComboCountries(countries) {

    countries.map((country) => {
        let optionT = document.createElement('option');
        optionT.text = country.Country;
        optionT.value = country.Slug;

        comboE.appendChild(optionT);
    });
}

// Evento no combobox
comboE.addEventListener("change", async () => {
    await queryAPICountries(comboE.value)
        .then(res => {
            res.map(result => {
                if (formatDate(result.Date) === todayE.value) {
                    console.log(result.Date)
                    populateSummary(result);
                }
            })
        })
});

// 1 Segundo para captura do que foi digitado ou clicado
todayE.addEventListener('change', () => {
    setTimeout(async () => {
        await queryAPICountries(comboE.value)
            .then(res => {
                res.map(result => {
                    if (formatDate(Date.parse(result.Date)) == Date.parse(todayE.value)) {
                        console.log(formatDate(result.Date))
                        console.log((todayE.value))
                        console.log(typeof (formatDate(result.Date)))
                        console.log(typeof (todayE.value))
                        populateSummary(result.Date);
                    }
                })
            })
    }, 1000)
});

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

    return [year, month, day].join('-').toString();
}