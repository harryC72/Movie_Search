let proxyUrl = "https://cors-anywhere.herokuapp.com/";
let baseUrl =
  "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&titles=";
let testUrl =
  "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&prop=extracts&explaintext=1&srsearch=";

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

// function orderFilterResult(result) {
//   let workArr = [...result];
//   let resultArr = workArr.sort(function(a, b) {
//     return b.title.length - a.title.length;
//   });
//   console.log("ResultArr", resultArr);
//   return resultArr;
// }

function titleSearch(searchInput, year) {
  let fetchUrl = testUrl + searchInput;
  return fetch(proxyUrl + fetchUrl)
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let searchData = data.query.search;
      return searchData;
    })
    .catch(function(error) {
      console.log(error);
    });
}

function moreDetailedTitleSearch(searchInput, year) {
  let str = `${searchInput} (${year} film)`;
  str = str.replace(/\s+/g, "_");
  console.log(str);

  let fetchUrl = baseUrl + str;

  return fetch(proxyUrl + fetchUrl)
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      data = data.query.pages;
      return data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

async function getTitle(searchInput, year) {
  let searchData = await titleSearch(searchInput, year);
  let resultNameAndYear;
  let resultName;
  let resultNewSearch;
  resultNameAndYear = searchData.filter(item => {
    if (item.title.includes(searchInput) && item.title.includes(year)) {
      item.withNameAndYear = true;
      return item.title;
    }
    return null;
  });

  if (resultNameAndYear.length) {
    return resultNameAndYear[0].title;
  }

  resultName = searchData.filter(item => {
    if (item.title === searchInput) {
      return item.title;
    }
    return null;
  });

  if (resultName.length) {
    return resultName[0].title;
  }

  resultNewSearch = await moreDetailedTitleSearch(searchInput, year);
  let key = Object.keys(resultNewSearch)[0];
  resultNewSearch = resultNewSearch[key].title;

  if (resultNewSearch.length) {
    return resultNewSearch;
  } else {
    return "No result";
  }
}

export default async function searchWiki(searchInput, year) {
  let title = await getTitle(searchInput, year);
  let resultObj = {};
  resultObj.title = title;
  let fetchUrl = baseUrl + title;
  return fetch(proxyUrl + fetchUrl)
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let key = Object.keys(data.query.pages)[0];
      let string = data.query.pages[key].extract;
      string = string.substring(0, string.indexOf("\n"));
      resultObj.string = string;
      return resultObj;
    })
    .catch(function(error) {
      console.log(error);
    });
}
