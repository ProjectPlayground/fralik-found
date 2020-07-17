import React, {useState, useEffect, useContext} from 'react';
import MainContentWrapper from './MainContentWrapper';
import {
  makeStyles,
  TextField,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import Snackbar from './Snackbar';
import firebase from 'firebase';
import db from "../config/firestoreDb";
import ContentPaper from './ContentPaper';
// import LanguageInput from './LanguagesInput';
import GoogleMapsAutoComplete from './GoogleMapsSearchBox';
import updateUserAccountInfo from '../auth/updateUserAccountInfo';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: theme.typography.special,
    color: theme.palette.primary.main
  },
  form: {
    padding: theme.spacing(1),
    maxWidth: 500
  },
  textInput: {
    width: 300
  },
  sectionDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    margin: theme.spacing(2),
    fontFamily: theme.typography.special,
  },
}));


export default function EditProfile(){
    const classes = useStyles();
    const [user, setUser] = useState({
      contact: {},
      location: {},
      languages: [],
    });
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [bio, setBio] = useState("");
    const [languages, setLanguages] = useState([])
    const [location, setLocation] = useState({});
    const [snackbar, setSnackbar] = useState({
      msg: null,
      severity: null,
    });
  
  // TODO: refactor to put in another component...just throwing code elsewhere
  // was causing problems...i think it might have to do w fact that this uses
  // web sockets
  useEffect(()=>{
    const deactivate = firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const uid = firebase.auth().currentUser.uid;
        const res = await db.collection("users").doc(uid).get();
        if (res.empty) {
          console.log("No matching documents.");
          setUser(null);
          return;
        }
        const thisUser = res.data()
        setUser(thisUser);
        setFirstName(thisUser.first_name);
        setLastName(thisUser.last_name);
        setEmail(thisUser.contact.email);
        setPhone(thisUser.contact.phone);
        setWebsite(thisUser.contact.website);
        setWhatsapp(thisUser.contact.whatsapp);
        setBio(thisUser.bio);
        setLanguages(thisUser.languages || []);
        setLocation(thisUser.location || {});
        return deactivate();
      }
    });
  },[])
    
  const inputChangeHandler = e => {
    switch(e.target.name){
      case "firstName": 
        setFirstName(e.target.value);
        break;
      case 'lastName':
        setLastName(e.target.value)
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'phone':
        setPhone(e.target.value);
        break;
      case 'website': 
        setWebsite(e.target.value);
        break;
      case 'whatsapp':
      setWhatsapp(e.target.value);
        break;
      case 'bio':
        setBio(e.target.value);
        break;
      case 'location':
        setLocation(e.target.value);
        break;
      case 'languages':
        setLocation(e.target.value);
        break;
      default: 
      return
    }
    
  }
  const updateProfile = async () => {
    const uid = user.uid;
    const res = await updateUserAccountInfo({
      firstName, lastName, email, phone, website, whatsapp, bio, location, languages, uid
    });
    console.log(res.message);
    setSnackbar({ msg: res.message.content, severity: res.message.type });
  }

  return (
  <>
    <MainContentWrapper>
      <ContentPaper>
        <Typography
          variant="h4"
          component="h3"
          color="primary"
          className={classes.title}
        >
          Edit Account Info
        </Typography>
        {user.uid && (
          <form className={classes.form} noValidate onSubmit={updateProfile}>
            <div className={classes.primaryInfo}>
              <div>
                <TextField
                  id="first-name"
                  name="firstName"
                  label="First Name"
                  color="secondary"
                  value={firstName}
                  defaultValue={user.first_name}
                  className={classes.textInput}
                  onChange={inputChangeHandler}
                  required
                />
              </div>
              <div>
                <TextField
                  id="last-name"
                  label="Last Name"
                  name="lastName"
                  color="secondary"
                  value={lastName}
                  defaultValue={user.last_name}
                  className={classes.textInput}
                  onChange={inputChangeHandler}
                  required
                />
              </div>
            </div>
            <Divider className={classes.sectionDivider} />
            <div className={classes.contact}>
              <Typography
                variant="h5"
                component="h3"
                color="primary"
                className={classes.title}
              >
                Contact Information
              </Typography>
              <Typography variant="p" component="p" color="textSecondary">
                Prospective guests can use these methods to contact you.{" "}
              </Typography>
              <div>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  color="secondary"
                  value={email}
                  defaultValue={user.contact.email}
                  className={classes.textInput}
                  onChange={inputChangeHandler}
                  helperText="This email is just for guests to contact you. It will not affect your login account."
                  required
                />
              </div>
              <div>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  type="tel"
                  value={phone}
                  defaultValue={user.contact.phone}
                  color="secondary"
                  onChange={inputChangeHandler}
                  className={classes.textInput}
                />
              </div>
              <div>
                <TextField
                  id="website"
                  name="website"
                  label="Website"
                  type="url"
                  value={website}
                  defaultValue={user.contact.website}
                  color="secondary"
                  onChange={inputChangeHandler}
                  className={classes.textInput}
                />
              </div>
              <div>
                <TextField
                  id="whatsapp"
                  label="Whatsapp"
                  name="whatsapp"
                  value={whatsapp}
                  defaultValue={user.contact.whatsapp}
                  type="tel"
                  onChange={inputChangeHandler}
                  color="secondary"
                  className={classes.textInput}
                />
              </div>
            </div>
            <Divider className={classes.sectionDivider} />
            <div className={classes.additionalInfo}>
              <Typography
                variant="h5"
                component="h3"
                color="primary"
                className={classes.title}
              >
                Additional Information
              </Typography>
              <Typography variant="p" component="p" color="textSecondary">
                Add a bit more information for prospective guests to have a
                better idea of who you are and why they should stay with you.
              </Typography>
              <div>
                <TextField
                  id="bio"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  value={bio}
                  defaultValue={user.bio}
                  color="secondary"
                  onChange={inputChangeHandler}
                  style={{ width: "100%" }}
                />
              </div>
              {/* <div>
              <LanguageInput name="languages" value={languages} formSetter={inputChangeHandler}/>
            </div> */}
              <div>
                {user.location.description && <GoogleMapsAutoComplete
                  variant="standard"
                  label="Location"
                  name="location"
                  inputVal={location.description}
                  defaultValue={
                    user.location.description ? user.location.description : null
                  }
                  formSetter={setLocation}
                  className={classes.textInput}
                  helperText={user.location.description ? `Your current location is: ${user.location.description}` : "You haven't set a location yet"}
                />}
              </div>
            </div>
            <div className={classes.buttonWrapper}>
              <Button
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={updateProfile}
              >
                Update Profile
              </Button>
            </div>

            {/* TODO: change username functionality */}
            {/* this will take some config with the DB to do in a non-hacky way */}
            {/* gotta present race conditions and all that */}
            {/* <TextField id="standard-basic" label="Username"/> */}
          </form>
        )}
      </ContentPaper>
    </MainContentWrapper>
    {snackbar.msg && <Snackbar msgSeverity={snackbar.severity} msg={snackbar.msg}/>}
  </>
  );
}