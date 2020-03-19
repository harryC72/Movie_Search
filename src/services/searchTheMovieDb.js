let proxyUrl = "https://cors-anywhere.herokuapp.com/";
let baseUrl = "https://api.themoviedb.org/3";

function addAuthParam(authKey) {
  return "?api_key=" + authKey;
}

export default function searchMovieDb(searchInput) {
  let auth = "dd8eb44d82d3d2d69fa5f42b5332dc8b";
  auth = addAuthParam(auth);

  console.log("SEARCHINPUT DB", searchInput);
  let fetchUrl = `${baseUrl}/movie/${searchInput}/similar${auth}`;
  let options = {
    method: "GET"
  };

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  return fetch(proxyUrl + fetchUrl, options)
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("SIMILAR MOVIES", data);
      return data;
    })
    .catch(function(error) {
      console.log(error);
    });
}
