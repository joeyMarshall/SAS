import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { storage, db } from "../firebase";
import "./PostPage.css";
import Geocode from "react-geocode";
import { Button } from "@material-ui/core";

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
}) {
  const [caption, setCaption] = useState("");
  const [keyword, setKeyword] = useState("");
  const [addresss, setAddresss] = useState("");
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
        Geocode.setApiKey("AIzaSyA8faJEyEJLo8QkFWHjvprH17SPVLJeO8Q");
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
        // complete function ...
        // storage
        //   .ref("images")
        //   .child(image.name)
        //   .getDownloadURL() //GET DOWNLOAD LINK TO THE IMAGE
        //   .then((url) => {
        //post image inside db
        db.collection("posts").add({
          //get server timestamp so images are sorted by time posted
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          keyword: keyword,
          //addresss: addresss,
          // imageUrl: url,
          username: user.displayName,
          // keyword: keyword,
          status: "Submitted",
          address: address,
          neighborhood: neighborhood,
          street: street,
        });

        setProgress(0); //reset progress
        setCaption("");
        setKeyword("");
        // setAddresss("");
        setImage(null);
        // setKeyword("");
        setStatus("");
        // });
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
        <br></br>
        <input
          type="text"
          placeholder="Incident Keyword"
          onChange={(event) => setKeyword(event.target.value)}
          value={keyword}
        />
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
            placeholder="Click the button to add your location or type it here..."
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          <br></br>
          {/* <input
            placeholder="Location of the incident..."
            value={addresss}
            onChange={(event) => setAddresss(event.target.value)}
          /> */}
        </div>
        {/* <input
          type="file"
          className="postPage__buttonInput"
          onChange={handleChange}
        /> */}

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
