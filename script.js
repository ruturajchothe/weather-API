
// Get country data from rest_countries API
let countries_data = [];

fetch('https://restcountries.eu/rest/v2/all')
  .then(response => response.json())
  .then(data => {
      countries_data = getCountries(data);
      console.log(countries_data);
      createCardRows(countries_data);
    })
    .catch((error) =>  {
        console.log(error);
        let err = createElement('p', 'display-4 text-center')
        err.setAttribute('style', 'color: red')
        err.innerText = 'Oops! we encountered an error'
        document.getElementById('CardContainer').append(err)
    });

//Function to create array of arrays consisting of 4 countries
let getCountries = (arr) => {
    let tempArr = [];
    for(let i = 0; i < arr.length; i += 4){
        let temp = [];
        temp.push(arr[i])
        temp.push(arr[i + 1])
        temp.push(arr[i + 2])
        temp.push(arr[i + 3])
        tempArr.push(temp)
    }
    // console.log(tempArr)
    return tempArr;
}

//function to create eleemtns with given class names and id names

let createElement = (elementName, className='', id='') => {
    let newElement = document.createElement(elementName);
    newElement.setAttribute('class', className);
    newElement.id =  id;
    return newElement;
}

//Creating cards for given country details
let createCardRows = (arr) => {
    let row = createElement('div', 'row');
    arr.forEach(element => {
        //each element is an array of 4 arrays
        //so iterate again through that array to create card of each country
        element.forEach(country => {
            if(typeof country !== 'undefined'){
                let col = createCard(country);
                row.append(col);
            }
        });
    });
    document.getElementById("CardContainer").append(row);
}

//Function to create card for given country details
let createCard = (details) => {
    console.log("In card")
    let col = createElement('div', 'col col-sm-3 mt-5');
    let card = createElement('div', 'card');
    let cardHeader = createElement('div', 'card-header');
    cardHeader.innerText = details.name;
    let image = createElement('img', 'card-img-top')
    let url = `https://www.countryflags.io/${details.alpha2Code}/flat/64.png`;
    image.setAttribute('src', url);
    image.setAttribute('alt', details.name);
    let ul = createElement('ul', 'list-group list-group-flush');
    let span = `<span class="badge badge-success">${details.capital}</span>`
    let countryCodes = details.alpha2Code+', '+details.alpha3Code
    let capital = createli('Capital', span);
    let codes = createli('Country Codes', countryCodes);
    let region = createli('Region', details.region);
    let lat = (+details.latlng[0]).toFixed(2)
    let lng = (+details.latlng[1]).toFixed(2)
    let latLong = createli('Lat-Long', lat+', '+lng);
    let buttonli = createli('button', details.capital)
    ul.append(capital, codes, region, latLong, buttonli);
    card.append(cardHeader, image, ul);
    col.append(card);
    return col;
}

//Creating list of details present in card
let createli = (key, innerhtml) => {
    let li = createElement('li', 'list-group-item text-center');
    if(key === 'button'){
        let button = createElement('button', 'btn btn-primary');
        button.onclick = ()=>{
            getWeather(innerhtml)
        }
        button.innerText = 'Get Weather'
        li.append(button);
        return li;
    }
    li.innerHTML = key+' : '+innerhtml;
    return li;

}

//getting the weather using openweathermap API
let getWeather = (countryCapital) => {
    console.log(countryCapital)
    let key = '7428a32b3711e5539acbae203cc5ab8a';
    let weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+countryCapital+'&appid='+key
    fetch(weatherUrl).then((data)=>{
        return data.json();
    }).then((data)=>{
        alert(countryCapital+' current weather : '+data.weather[0].description);
    }).catch((error)=>{
        alert('Weather not available for this Country');
    })
}