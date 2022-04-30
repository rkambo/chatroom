import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { SignInMethod } from 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyBNa1HFGFlRXmrnBCsT6EiX5Ty6CG4Jco4",
  authDomain: "chatroom-ec5ad.firebaseapp.com",
  projectId: "chatroom-ec5ad",
  storageBucket: "chatroom-ec5ad.appspot.com",
  messagingSenderId: "962837149029",
  appId: "1:962837149029:web:1056203cd54234edce1d8c",
  measurementId: "G-WHGFTVT053"
})

const auth = firebase.auth();
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
      </header>

      <section>
       {user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const dummy = useRef();

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({behaviour: 'smooth'})
  }

  return ( 
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg} />)}
        <div ref={dummy}></div>

      </main>
  
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit"> 👺 </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}
export default App;
