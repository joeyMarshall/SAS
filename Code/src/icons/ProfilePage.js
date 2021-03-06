import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./ProfilePage.css";
import ProfilePost from "../ProfilePost";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
// import LogoutIcon from "@material-ui/icons/";
import IconButton from "@material-ui/core/IconButton";

function ProfilePage({ user, username, address, setAddress }) {
  /*states...how you set variables in react*/
  const [posts, setPosts] = useState([]);

  //useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    //snapshot is a powerful listener that will run the code when a post is made
    db.collection("posts")
      .where("username", "==", user.displayName)
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
  }, []);

  return (
    <div className="profilePage">
      {/* Button for small devices */}
      {/* <IconButton */}
      <Button
        size="large"
        classes={{ label: "profilePage__button d-block d-lg-none" }}
        component={Link}
        to="/ProfilePage/Settings"
      >
        Sign Out
      </Button>
      {/* <LogoutIcon />
      </IconButton> */}

      {/* Button for large devices */}
      <Button
        size="large"
        classes={{ label: "profilePage__buttonLarge d-none d-lg-flex" }}
        component={Link}
        to="/ProfilePage/Settings"
      >
        Sign Out
      </Button>
      <div className="profilePage__posts">
        <div className="profilePage_postsRight">
          {/* posts */}
          {
            /*loop through posts*/
            posts.map(({ id, post }) => (
              <ProfilePost
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                status={post.status}
                reason={post.reason}
                address={post.address}
                addresss={post.addresss}
                keyword={post.keyword}
              ></ProfilePost>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
