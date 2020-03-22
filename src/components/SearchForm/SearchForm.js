import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import searchIMDB from "../../services/searchIMDB";
import Spinner from "../Spinner/Spinner";
import MovieCard from "../MovieCard/MovieCard";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TheatersIcon from "@material-ui/icons/Theaters";
import ErrorToast from "../ErrorToast/ErrorToast";

const useStyles = makeStyles({
  root: {
    width: 200,
    padding: "20px 0 20px 0"
  },
  searchField: {
    width: 200,
    padding: "5px 0 5px 0"
  },
  searchButton: {
    width: 200
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    padding: "0 5px 0 5px",
    fontFamily: "Roboto Slab",
    fontSize: "22px"
  }
});

export default function BasicTextFields() {
  const [searchValue, setSearchValue] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState("");
  const [validationError, setValidationError] = useState();

  const classes = useStyles();

  function sortMovieResult(result, searchValue) {
    let returnResult = result;
    if (!returnResult) {
      setSearchError("No result from IMDB");
      setShowSpinner(false);
      return;
    }

    returnResult = returnResult.filter(key => {
      return key.q === "feature";
    });

    returnResult = returnResult.sort((a, b) => {
      return a.l.length - b.l.length;
    });

    return returnResult;
  }

  async function searchMovie(searchValue, callback) {
    searchValue = validateSearchValue(searchValue);
    if (!searchValue) {
      return;
    }
    setShowSpinner(true);
    let result = await callback(searchValue);

    if (result) {
      setShowSpinner(false);
    }

    result = sortMovieResult(result, searchValue);

    setSearchResult(result);
  }

  function displaySearchResult(result) {
    return (
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {result.map(item => {
          return (
            <MovieCard
              style={{ padding: "5px" }}
              key={item.id}
              id={item.id}
              image={item.i[0]}
              title={item.l}
              year={item.y}
              starring={item.s}
              wikiSearch={item.l}
              describeError={setSearchError}
              setProgress={setProgress}
            />
          );
        })}
      </Box>
    );
  }

  function takeAwayError() {
    setSearchError("");
  }

  function setProgress(value) {
    setShowSpinner(value);
  }

  const spinner = showSpinner ? <Spinner /> : null;

  const errorToast = searchError.length ? (
    <ErrorToast message={searchError} clickEvent={takeAwayError} />
  ) : null;

  function inputDelivered(input) {
    if (!input) {
      setValidationError("No title entered");
      return;
    }
    setValidationError("");
    setSearchValue(input);
  }

  function validateSearchValue(searchValue) {
    console.log("searchValue", searchValue);
    if (!searchValue.length) {
      setValidationError("No title entered");
      return;
    }

    if (!/[A-Z]/.test(searchValue[0])) {
      setValidationError("Title should start with letter");
    }

    return searchValue;
  }

  return (
    <div>
      <Box display="flex" justifyContent="center">
        <form className={classes.root} noValidate autoComplete="off">
          <Box flexDirection="column" display="flex" justifyContent="center">
            <Box
              style={{ padding: "20px 0 20px 0" }}
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <TheatersIcon />
              <Typography className={classes.title}>Search movies</Typography>
              <TheatersIcon />
            </Box>
            <TextField
              className={classes.searchField}
              id="outlined-basic"
              variant="outlined"
              error={validationError ? true : false}
              helperText={validationError}
              onChange={e => inputDelivered(e.target.value)}
            />
            <Button
              className={classes.searchButton}
              onClick={() => searchMovie(searchValue, searchIMDB)}
              variant="contained"
            >
              Search
            </Button>
            <Box
              display="flex"
              justifyContent="center"
              style={{ padding: "20px 0 20px 0" }}
            >
              {spinner}
            </Box>
          </Box>
        </form>

        {errorToast}
      </Box>

      {searchResult ? displaySearchResult(searchResult) : null}
    </div>
  );
}
