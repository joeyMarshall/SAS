import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { storage, db } from "../firebase";
import "./PostPage.css";
import Geocode from "react-geocode";
import { Button } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import "./HomePage.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function PostPage({
  user,
  progress,
  setProgress,
  setAddress,
  // setKeyword,
  address,
  setNeighborhood,
  neighborhood,
  setStreet,
  street,
  // caption,
  // setCaption,
}) {
  /*states...how we set variables in react*/
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = React.useState("");
  const [openDropDown, setOpenDropDown] = React.useState(false);
  const classes = useStyles();
  const handleChangeDropDown = (event) => {
    setKeyword(event.target.value);
  };

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = React.useState(""); //state to keep track of post status
  const handleChange = (e) => {
    //handleChange function fires off an event
    if (e.target.files[0]) {
      //get the first file you selected
      setImage(e.target.files[0]); //set the image in state to that file
    }
  };

  //Implement geoLocation. Get the user's address. Function is called when
  // "Get address" button is clicked
  const geoFunction = (event) => {
    event.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      });
    }

    if ("geolocation" in navigator) {
      console.log("Geolocation Available");
    } else {
      console.log("Geolocation Not Available");
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // Geocode.setApiKey("AIzaSyA8faJEyEJLo8QkFWHjvprH17SPVLJeO8Q");
        Geocode.setApiKey("AIzaSyAh-OCWnu2Gfo_zSA5l0dfbaN05CypGuNU");
        Geocode.setLanguage("en");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            setAddress(response.results[0].formatted_address);
            let city, state, country;
            for (
              let i = 0;
              i < response.results[0].address_components.length;
              i++
            ) {
              for (
                let j = 0;
                j < response.results[0].address_components[i].types.length;
                j++
              ) {
                switch (response.results[0].address_components[i].types[j]) {
                  case "locality":
                    city = response.results[0].address_components[i].long_name;
                    break;
                  case "administrative_area_level_1":
                    state = response.results[0].address_components[i].long_name;
                    break;
                  case "country":
                    country =
                      response.results[0].address_components[i].long_name;
                    break;
                  case "neighborhood":
                    setNeighborhood(
                      response.results[0].address_components[i].long_name
                    );
                    break;
                  case "route":
                    setStreet(
                      response.results[0].address_components[i].long_name
                    );
                    break;
                }
              }
            }
            console.log(city, state, country);
            console.log(address);
            console.log(neighborhood);
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  };

  const handleUpload = () => {
    //access the storage in firebase, get a references to the folder images/ and store image there
    const uploadTask = storage.ref(`images/$n`).put(image);

    uploadTask.on(
      "state_changed",
      /*provide snapshot of the image uploading progress via an equation*/
      (snapshot) => {
        //progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error function ..
        console.log(error);
        alert(error.message);
      },
      () => {
        db.collection("posts").add({
          //get server timestamp so images are sorted by time posted
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          keyword: keyword,

          username: user.displayName,

          status: "Submitted",
          address: address,
          neighborhood: neighborhood,
          street: street,
        });

        setCaption("");
        setKeyword("");
        setAddress("");
        setImage(null);
        setStatus("");
      }
    );
  };

  return (
    <div className="postPage">
      <h1>Share Your Story</h1>
      <div className="postPage__details">
        <input
          type="text"
          placeholder="Please describe the incident..."
          onChange={(event) => setCaption(event.target.value)}
          value={caption}
        />

        <div className="homePage__dropdown">
          <FormControl className={classes.formControl}>
            <InputLabel
              id="demo-controlled-open-select-label"
              classes={{ label: "profilePage__buttonLarge d-none d-lg-flex" }}
            >
              Keyword
            </InputLabel>

            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={openDropDown}
              onClose={() => setOpenDropDown(false)}
              onOpen={() => setOpenDropDown(true)}
              value={keyword}
              onChange={handleChangeDropDown}
            >
              <MenuItem value="">
                <em>--Choose a Keyword--</em>
              </MenuItem>

              <MenuItem
                onChange={(event) => setKeyword(event.target.value)}
                value={"Verbal Abuse"}
              >
                Verbal Abuse
              </MenuItem>
              <MenuItem
                onChange={(event) => setKeyword(event.target.value)}
                value={"Stereotypes"}
              >
                Stereotypes
              </MenuItem>
              <MenuItem
                onChange={(event) => setKeyword(event.target.value)}
                value={"Other"}
              >
                Other
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="postPage__location">
          <button
            className="postPage__button"
            type="submit"
            id="nudge"
            onClick={geoFunction} //Function call
          >
            Add Location
          </button>
          <input
            placeholder="Click the button to add your location or type it manually"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>

        <Button
          classes={{ label: "postPage__image" }}
          onClick={handleUpload}
          component={Link}
          to="/PostPage/ReportSubmitted"
        >
          Share
        </Button>
      </div>
    </div>
  );
}

export default PostPage;
