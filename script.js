const firebaseConfig = {
  apiKey: "AIzaSyDTqogypOICj7kR9WzbxQ5087UmOMTbaoA",
  authDomain: "private-chat-9c173.firebaseapp.com",
  projectId: "private-chat-9c173",
  storageBucket: "private-chat-9c173.appspot.com",
  messagingSenderId: "553350962488",
  appId: "1:553350962488:web:80c1e9049cf016641675cd"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
    listenForMessages();
  } else {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('chat-section').style.display = 'none';
  }
});

function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, pass)
    .catch(alert);
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(alert);
}

function logout() {
  auth.signOut();
}

function sendMessage() {
  const msg = document.getElementById("messageInput").value;
  if (msg.trim() === "") return;
  db.collection("messages").add({
    user: auth.currentUser.email,
    message: msg,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  document.getElementById("messageInput").value = "";
}

function listenForMessages() {
  db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      messagesDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.message}</p>`;
    });
  });
}
