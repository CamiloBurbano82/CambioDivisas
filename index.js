let btnConvertir = document.getElementById("btnConvertir");
let btnHoy = document.getElementById("hoy");
let btnBuscar = document.getElementById("btnBuscar");
let tablaHead = document.querySelector("#tabla thead");
let tablaBody = document.querySelector("#tabla tbody");
let tablaFoot = document.querySelector("#tabla tfoot");
let monedaUno = document.getElementById("monedaUno");
let monedaDos = document.getElementById("monedaDos");
let monedaUnoGraficar = document.getElementById("monedaUnoGraficar");
let monedaDosGraficar = document.getElementById("monedaDosGraficar");
let cantidadUno = document.getElementById("cantidadUno");
let cantidadDos = document.getElementById("cantidadDos");
let fechaInicial = document.getElementById("fechaInicial");
let fechaFinal = document.getElementById("fechaFinal");
let grafica = document.getElementById("grafica");
let myChart;

let monedas = ["AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HRK", "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PLN", "RON", "SEK", "SGD", "THB", "TRY", "ZAR"];

let nombreMonedas = ["dólar australiano", "lev Búlgaro", "real brasileño", "dólar Canadiense", "franco suizo", "yuan renmindi chino", "corona checa", "corona danesa", "euro", "libra esterlina", "dólar de Hong Kong", "kuna croata", "florín húngaro", "rupia indonesia", "séquel israelí", "rupia india", "corona islandesa", "yen japonés", "won surcoreano", "peso mexicano", "ringgit malayo", "corona noruega", "dólar de Nueva Zelanda", "peso filipino", "zloty polaco", "leu rumano", "corona sueca", "dólar de Singapur", "baht tailandés", "lira turca", "rand sudafricano"]

for (let i = 0; i < monedas.length; i++) {

    const opcionUno = document.createElement("option");
    const opcionDos = document.createElement("option");
    const opcionUnoGraficar = document.createElement("option");
    const opcionDosGraficar = document.createElement("option");

    opcionUno.value = monedas[i];
    opcionUno.innerHTML = nombreMonedas[i] + " " + monedas[i];
    opcionDos.value = monedas[i];
    opcionDos.innerHTML = nombreMonedas[i] + " " + monedas[i];
    opcionUnoGraficar.value = monedas[i];
    opcionUnoGraficar.innerHTML = nombreMonedas[i] + " " + monedas[i];
    opcionDosGraficar.value = monedas[i];
    opcionDosGraficar.innerHTML = nombreMonedas[i] + " " + monedas[i];

    monedaUno.appendChild(opcionUno);
    monedaDos.appendChild(opcionDos);
    monedaUnoGraficar.appendChild(opcionUnoGraficar)
    monedaDosGraficar.appendChild(opcionDosGraficar)
}

async function latest() {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let data;

    fetch('https://api.frankfurter.app/latest?from=USD')
        .then(resp => resp.json())
        .then(json => { data = (json) });
    await delay(5000);
    return data;
}

async function hoy() {

    tablaHead.innerHTML = '';
    tablaBody.innerHTML = '';

    let i = 0;
    let data = await latest();
    let dataRates = data.rates;

    var tr = document.createElement("tr"),
        thMoneda = document.createElement("th"),
        thValor = document.createElement("th");

    thMoneda.innerHTML = "Divisa";
    thValor.innerHTML = "Valor del día (USD)";

    tr.appendChild(thMoneda);
    tr.appendChild(thValor);
    tablaHead.appendChild(tr);

    var ftr = document.createElement("tr"),
        tdFecha = document.createElement("td");

    tdFecha.innerHTML = "Fecha de consulta " + data.date;
    ftr.appendChild(tdFecha);
    tablaFoot.appendChild(ftr);

    for (let clave in dataRates) {
        if (dataRates.hasOwnProperty(clave)) {

            var tr = document.createElement("tr"),
                tdMoneda = document.createElement("td"),
                tdValor = document.createElement("td");

            tdMoneda.innerHTML = nombreMonedas[i] + " " + clave;
            tdValor.innerHTML = dataRates[clave];

            tr.appendChild(tdMoneda);
            tr.appendChild(tdValor);
            tablaBody.appendChild(tr);
            i++;
        }
    }

}

hoy();

async function conversion() {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let data;
    fetch(`https://api.frankfurter.app/latest?amount=${cantidadUno.value}&from=${monedaUno.value}&to=${monedaDos.value}`)
        .then(resp => resp.json())
        .then(json => { data = (json.rates) });
    await delay(5000);
    for (let clave in data) {
        if (data.hasOwnProperty(clave)) {
            cantidadDos.value = data[clave];
        }
    }
}

btnConvertir.addEventListener("click", function () {
    conversion();
})

async function rango() {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let data;

    fetch(`https://api.frankfurter.app/${fechaInicial.value}..${fechaFinal.value}?from=USD&to=${monedaUnoGraficar.value},${monedaDosGraficar.value}`)
        .then(resp => resp.json())
        .then(json => { data = (json.rates) });
    await delay(5000);
    return data;
}

async function graficar() {

    let resultado = await rango();
    let fechas = [], data0 = [], data1 = [], data2 = [];

    for (let clave in resultado) {
        if (resultado.hasOwnProperty(clave)) {
            fechas.push(clave);
            data0.push(resultado[clave]);
        }
    }

    for (let clave in data0) {
        if (data0.hasOwnProperty(clave)) {
            data1.push(data0[clave][`${monedaUnoGraficar.value}`]);
            data2.push(data0[clave][`${monedaDosGraficar.value}`]);
        }
    }

    const data = {
        labels: fechas,
        datasets: [
            {
                label: `${monedaUnoGraficar.value}`,
                data: data1,
                borderColor: '#660000',
                backgroundColor: '#660000',
                yAxisID: 'y',
            },
            {
                label: `${monedaDosGraficar.value}`,
                data: data2,
                borderColor: '#6600CC',
                backgroundColor: '#6600CC',
                yAxisID: 'y1',
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Variación con respecto a USD'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',

                    grid: {
                        drawOnChartArea: false, 
                    },
                },
            }
        },
    };


    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(grafica, config);
}

btnBuscar.addEventListener("click", function () {
    graficar();
})
