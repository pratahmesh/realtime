import { useState, useEffect } from 'react';
import './App.css';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, app } from './firebase';

const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const sendMessage = async () => {
    await addDoc(collection(db, 'messages'), {
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex'>
      {user ? (
        <div className='chat-container'>
          <div className='chat-header'>
            <div>Logged in as {user.displayName}</div>
            <button className='logout' onClick={() => auth.signOut()}>Logout</button>
          </div>
          <div className='message-list'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.data.uid === user.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`message-content ${
                    msg.data.uid === user.uid ? 'user' : 'other'
                  }`}
                >
                  <img src={msg.data.photoURL} alt={msg.data.displayName} />
                  {msg.data.text}
                </div>
              </div>
            ))}
          </div>
          <div className='input-area'>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className='send' onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button className='login' onClick={handleGoogleLogin}>
          Login with Google
        </button>
      )}
    </div>
  );
}

export default App;
