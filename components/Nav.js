import Link from "next/link";
import {auth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';

function Nav(){
    const [user, loading] = useAuthState(auth);
    
    return (
        <nav className="flex justify-between items-center py-10">
            <Link href="/">
            <button className="text-lg font-medium">Buzzle</button>
            </Link>
            <ul className="flex items-center gap-10">
                {!user && (
                <Link href={"/auth/login"}>
                    <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
                        Join Now
                    </a>
                </Link>
                )}
                {user && (
                    <div className="flex items-center gap-6">
                        <Link href="/post">
                        <button className="py-2 px-5 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">Post</button>
                        </Link>
                        <Link href="/dashboard">
                            <img className= "w-10 rounded-full cursor-pointer" src={user.photoURL} />
                        </Link>
                    </div>

                )}
            </ul>
        </nav>
    )
}


export default Nav;
