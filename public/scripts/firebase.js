(() => {
  console.log(firebase);
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAm5lgXqwnpLHYOwlUF1Ltfdqd6iy3BoaE",
    authDomain: "shiba-sensei.firebaseapp.com",
    databaseURL: "https://shiba-sensei.firebaseio.com",
    projectId: "shiba-sensei",
    storageBucket: "shiba-sensei.appspot.com",
    messagingSenderId: "623810810903",
    appId: "1:623810810903:web:612e2bb2ba0d9c3318f852",
    measurementId: "G-G9LZ4V2W3Z"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const auth = firebase.auth();

  const whenSignedIn = document.getElementById('whenSignedIn');
  const whenSignedOut = document.getElementById('whenSignedOut');
  const userDetails = document.getElementById('userDetails');

  const signInBtn = document.getElementById('signInBtn');
  const continueAsGuestBtn = document.getElementById('continueAsGuestBtn');
  const signOutBtn = document.getElementById('signOutBtn');

  const provider = new firebase.auth.GoogleAuthProvider();
  signInBtn.onclick = () => auth.signInWithPopup(provider);
  continueAsGuestBtn.onclick = () => auth.signInAnonymously();
  signOutBtn.onclick = () => auth.signOut();

  auth.onAuthStateChanged(user => {
    if (user) {
      whenSignedIn.hidden = false;
      whenSignedOut.hidden = true;
      userDetails.innerHTML = `
        <img src="${user.photoURL}" width="35px" height="35px" style="border-radius: 50%;"/>
        <p>Welcome, <b>${user.displayName}</b> 👋</p>
      `;
    } else if (null) {
      whenSignedIn.hidden = false;
      whenSignedOut.hidden = true;
      userDetails.innerHTML = `
        <p>Welcome, <b>Anonymous User</b> 👋</p>
      `;
    } else {
      whenSignedIn.hidden = true;
      whenSignedOut.hidden = false;
      userDetails.innerHTML = '';
    }
  });
})();