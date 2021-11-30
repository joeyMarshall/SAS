import React, { useState, useEffect } from "react";
import "./HomePage.css";
import Post from "../Post";
import { db } from "../firebase";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import ListIcon from "@material-ui/icons/List";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Geocode from "react-geocode";

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

function HomePage({
  user,
  address,
  setAddress,
  setStreet,
  street,
  setNeighborhood,
  neighborhood,
}) {
  /*states...how we set variables in react*/
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = React.useState("");
  const [openDropDown, setOpenDropDown] = React.useState(false);
  const classes = useStyles();
  const handleChangeDropDown = (event) => {
    setKeyword(event.target.value);
  };

  // Function called when no filter is applied i.e. 'none' filter is clicked
  const noFilter = (event) => {
    db.collection("posts")
      // .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  // Function called when stereo filter is applied
  const stereotypesFilter = (event) => {
    event.preventDefault();

    db.collection("posts")
      .where("keyword", "==", "Stereotypes")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  // Function called when verbal filter is applied
  const vFilter = (event) => {
    event.preventDefault();

    db.collection("posts")
      .where("keyword", "==", "Verbal Abuse")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  // Function called when other filter is applied
  const otherFilter = (event) => {
    event.preventDefault();

    db.collection("posts")
      .where("keyword", "==", "Other")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  };

  //useEffect runs a piece of code based on a specific
  //condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      // .where("status", "==", "Approved")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id, //the post ids
            post: doc.data(),
          }))
        );
      });
  }, []); //[] symbol means run the code once;

  return (
    <div className="homePage">
      <div className="homePage__dropdown">
        <FormControl className={classes.formControl}>
          <InputLabel
            id="demo-controlled-open-select-label"
            classes={{ label: "profilePage__buttonLarge d-none d-lg-flex" }}
          >
            Filter By
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
              <em>--Filter by Category--</em>
            </MenuItem>
            <MenuItem onClick={noFilter} value={"None"}>
              None
            </MenuItem>
            <MenuItem onClick={vFilter} value={"Verbal Abuse"}>
              Verbal Abuse
            </MenuItem>
            <MenuItem onClick={stereotypesFilter} value={"Stereotypes"}>
              Stereotypes
            </MenuItem>
            <MenuItem onClick={otherFilter} value={"Other"}>
              Other
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="homePage__posts">
        <div className="homePage_postsRight">
          {/*Posts*/}
          {
            /*loop through posts in state*/
            posts.map(({ id, post }) => (
              //the key allows the page to only refresh the new post, not all the
              //posts. since each post has its own key
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                keyword={post.keyword}
                // imageUrl={post.imageUrl}
                address={post.address}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage;
