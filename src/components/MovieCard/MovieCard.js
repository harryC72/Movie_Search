import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import searchTheMovieDb from "../../services/searchTheMovieDb";
import searchWiki from "../../services/searchWiki";
import Collapse from "@material-ui/core/Collapse";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    textAlign: "left"
  },
  media: {
    height: 600
  }
}));

export default function MediaCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");
  const [similarMovies, setSimilarMovies] = useState([]);
  const [showingWikiInfo, setShowingWikiInfo] = useState(false);
  const [showingSimilarMovies, setShowingSimilarMovies] = useState(false);
  const [clicked, setClicked] = useState(false);

  async function searchSimilarMovies(searchValue, callback) {
    settingSpinner(true);
    let result = await callback(searchValue);

    if (result) {
      settingSpinner(false);
    }

    setSimilarMovies(result.results);
    return result;
  }

  async function getMoreWikiInfo(searchValue, year) {
    settingSpinner(true);
    let result = await searchWiki(searchValue, year);
    if (result) {
      settingSpinner(false);
    }
    if (!result.string) {
      settingSpinner(false);
      props.describeError("There is no info about this movie on Wikipedia");
      return;
    }
    setDescription(result.string);
    setWikiUrl(result.title);
    return result;
  }

  async function showSimilarMoviesInfo(searchValue, callback) {
    let result = await searchSimilarMovies(searchValue, callback);
    if (result.results.length === 0) {
      props.describeError("The database cannot find similar movies");
      return;
    }
    setClicked(true);
    if (result.results.length) {
      setShowingSimilarMovies(true);
    }
    setExpanded(true);
  }

  async function showWikiInfo(searchValue) {
    let result = await getMoreWikiInfo(searchValue, props.year);
    if (!result) {
      setClicked(false);
      return;
    }
    if (result.string.length) {
      setShowingWikiInfo(true);
    }
    setExpanded(true);
    setClicked(true);
  }
  function displaySimilarMovies(data) {
    return (
      <ul>
        {data.map(item => {
          return <li key={item.id}>{item["original_title"]}</li>;
        })}
      </ul>
    );
  }

  function displayWikiResult(desc, wikiUrl, imdbUrl) {
    return (
      <div>
        <p>{desc}</p>
        <Link href={`https://en.wikipedia.org/wiki/${wikiUrl}`}>
          More info on wiki
        </Link>
        <Link href={`https://www.imdb.com/title/${imdbUrl}`}>
          More info om IMDB
        </Link>
      </div>
    );
  }

  function settingSpinner(value) {
    props.setProgress(value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={props.image}
            title={props.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Title: {props.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="div">
              <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                <li>
                  <b>Year:</b>
                  {props.year}
                </li>
                <li>
                  <b>Starring: </b>
                  {props.starring}
                </li>
              </ul>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            disabled={showingWikiInfo ? true : false}
            onClick={
              !clicked
                ? () => {
                    showSimilarMoviesInfo(props.id, searchTheMovieDb);
                  }
                : () => {
                    setClicked(false);
                    setShowingSimilarMovies(false);
                    setExpanded(false);
                  }
            }
          >
            Similar movies
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={showingSimilarMovies ? true : false}
            onClick={
              !clicked
                ? () => {
                    showWikiInfo(props.wikiSearch);
                    setClicked(true);
                  }
                : () => {
                    setClicked(false);
                    setShowingWikiInfo(false);
                    setExpanded(false);
                  }
            }
          >
            Learn more
          </Button>
        </CardActions>
        <Collapse in={expanded} unmountOnExit>
          <CardContent>
            <Typography component="section">
              {showingSimilarMovies
                ? displaySimilarMovies(similarMovies)
                : null || showingWikiInfo
                ? displayWikiResult(description, wikiUrl, props.id)
                : null}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
