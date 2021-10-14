import fetch from "node-fetch";
import moment from "moment";

const API_URL = "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json";
const THRESHOLD = 0; // TODO: change to 1; 0 is just for testing

// Seattle coordinates
const LONG = -122.3321;
const LAT = 47.6062;

fetch(API_URL)
    .then((data) => data.json())
    .then((resp) => {
        const coords = getCords360(LONG, LAT);
        const forecast = resp.coordinates.find((c) => c[0] === coords[0] && c[1] === coords[1])[2];
        if (forecast >= THRESHOLD) notify(forecast, resp["Forecast Time"]);
    });

/*
    The API uses a 0-360 coordinate system, whereas humans typically use -180 - 180 for long & lat.
    This function converts them.
    It also rounds them since the API doesn't support floats.
    Formula from: http://www.idlcoyote.com/map_tips/lonconvert.html
*/
function getCords360(long180, lat180) {
    const lon360 = (long180 + 360) % 360;
    const lat360 = (lat180 + 360) % 360;
    return [Math.round(lon360), Math.round(lat360)];
}

function getPstTime(utc) {
    return moment.parseZone(utc).local().format("hh:mm:ss a");
}

function notify(forecast, utcTime) {
    const pstTime = getPstTime(utcTime);
    const subject = "AURORA ALERT";
    const message = `There is an Aurora forecast of ${forecast}% for ${pstTime}`;
    // TODO: send email to process.env.PHONE_NUMBER + "@txt.att.net";
}
