import React, { use } from 'react'
import Message from '../components/message'
import {useRouter} from "next/router"
import {auth, db} from '../utils/firebase'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { addDoc,
    arrayUnion,
    collection,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc, getDoc, onSnapshot } from 'firebase/firestore'


export default function Details() {
    const route = useRouter();
    const routeData = route.query;
    const [message, setMessage ] = useState('');
    const [allMessage, setAllMessage] = useState([]);
//Submit message

    const submitMessage = async () => {
        if(!auth.currentUser) return route.push('/auth/login');

        if (!message){
            toast.error("Don't leave an empty message :)", 
            {position : toast.POSITION.TOP_CENTER,
            autoClose: 1500,
        });
        return; 
        }
        const docRef = doc(db, "posts", routeData.id );
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });
        setMessage("");
    };
    //Get comments
    const getComments = async() => {

        const docRef = doc(db, "posts", routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) =>{
            setAllMessage(snapshot.data().comments);
        });
        return unsubscribe;
  };
  useEffect(() => {
   if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4 mx-2">
        <div className="flex">
            <input onChange={(e) => setMessage(e.target.value)} type="text" value={message} placeholder="Send a Comment :)"
            className="bg-blue-900 w-full p-2 text-white text-sm rounded-full"
            ></input>
            <button onClick={submitMessage}
            className="bg-cyan-500 text-white text-sm py-2 px-4 rounded-full">
                Submit</button>
        </div>
        <div className="py-6">
            <h2 className="font-bold">Comments</h2>
            {allMessage?.map(message => (
                <div className='bg-white p-4 my-4 border-2 rounded-full' key={message.time}>
                    <div className='flex items-center gap-2 mb-4 px-8'>
                        <img className='w-10 rounded-full' src={message.avatar} alt="" />
                        <h2>{message.userName}</h2>
                    </div>
                    <h2 className='flex items-center gap-2 mb-4 px-8'>{message.message}</h2>
                </div>
            ))}

        </div>
      </div>
    </div>
  )
}
