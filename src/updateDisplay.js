import * as weatherFetcher from './weatherFetcher.js';
import { prefersTempC, moreInformationType } from ".";
import * as icons from './iconGetter.js';

let weatherContainer = document.querySelector(".currentW-cont");
let cityNameDom = weatherContainer.querySelector(".city-name");
let currentTimeDom = weatherContainer.querySelector(".current-time");
let currentIconDom = weatherContainer.querySelector(".current-weather-icon");
let currentDegreeDom = weatherContainer.querySelector(".current-weather-degree");
let currentConditionDom = weatherContainer.querySelector(".current-condition");
let moreInformationDom = document.querySelector(".details-cont");



export async function updateDisplay(cityName){



    let forecastResponse = await weatherFetcher.fetchWeatherForecast(cityName);

    console.log(forecastResponse);
    if(forecastResponse.ok){
        let data = forecastResponse.data;
        let location = data.location;
        let current = data.current;

        let condition = current.condition.text;

        let cityName = location.name;
        let localTime = location.localtime.split(" ")[1];

        let tempC = current.temp_c;
        let tempF = current.temp_f;

        cityNameDom.innerText = cityName;
        currentTimeDom.innerText = localTime;




        if(prefersTempC){
            currentDegreeDom.innerText = tempC + "°";
        } else {
            currentDegreeDom.innerText = tempF + "°";
        }

        currentConditionDom.innerText = condition;
        let dayTime 
        if(current.is_day === 1) dayTime = "day"; 
        else dayTime = "night";

        currentIconDom.src = icons[dayTime][condition.replaceAll(' ', '-')];
        currentIconDom.alt = condition;

// populate more information field

        let forecastDays = data.forecast.forecastday;



        if(moreInformationType === "hourly"){
            moreInformationDom.innerHTML = "";
            let currentHour = Number(localTime.split(":")[0]);
            let currentDayId = 0;
            console.log(currentHour);
            for(let i=0; i<24; i++){
                currentHour++;
                if(currentHour === 24){
                    currentDayId++;
                    currentHour=0;
                }

                
                let hourData = forecastDays[currentDayId]["hour"][currentHour];

                let dayTime;
                if(hourData.is_day === 1) dayTime = "day";
                else dayTime = "night";
                let condition = hourData.condition.text;

                let cont = document.createElement("div");
                cont.classList.add("weather-cont");


            //<img class="small-weather-icon" src="https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/overcast-day-drizzle.svg" alt="">
                let img = document.createElement("img");
                img.classList.add("small-weather-icon");
                img.src = icons[dayTime][condition.replaceAll(' ', '-')];
                img.alt = condition;
                cont.appendChild(img);

                let infoDiv = document.createElement("div");
                infoDiv.classList.add("info");
                cont.appendChild(infoDiv);

                let timeSpan = document.createElement("span");
                timeSpan.classList.add("time-small");
                timeSpan.innerText = currentHour + ":00";
                infoDiv.appendChild(timeSpan);

                let dashSpan = document.createElement("span");
                dashSpan.innerText = " - ";
                infoDiv.appendChild(dashSpan);
                
                let tempSpan = document.createElement("span");
                tempSpan.classList.add("degrees-small");
                if(prefersTempC){
                    tempSpan.innerText = hourData.temp_c + "°";
                } else {
                    tempSpan.innerText = hourData.temp_f + "°";
                }
                infoDiv.appendChild(tempSpan);


                let hoverConditionDiv = document.createElement("div");
                hoverConditionDiv.classList.add("hover-condition");
                hoverConditionDiv.innerText = condition;
                infoDiv.appendChild(hoverConditionDiv);

                moreInformationDom.appendChild(cont);
            }
        }

    } else{

    }
}