import fetchJsonp from "fetch-jsonp";
import { inputCleaner } from "../utils/helperFunctions.js";

let baseUrl = "http://sg.media-imdb.com/suggests/";

// function handleErrors(response) {
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   return response;
// }

function getParameters(input) {
  let first = input.charAt(0);
  let result = `${first}/${input}.json`;
  return result;
}

export default function searchIMDB(inputValue) {
  let cleanedInput = inputCleaner(inputValue);
  let parameters = getParameters(cleanedInput);
  let fetchUrl = `${baseUrl}${parameters}`;
  console.log("FETCHURL", fetchUrl);

  return fetchJsonp(fetchUrl, { jsonpCallbackFunction: `imdb$${cleanedInput}` })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log("parsed json", json.d);
      return json.d;
    })
    .catch(function(err) {
      console.log("parsing failed", err);
    });
}
