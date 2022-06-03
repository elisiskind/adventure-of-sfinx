import {auth} from "index"
import {createContext, useEffect, useState} from "react";
import {Login} from "./Login";

interface Auth {
    userId: string;
}

export const AuthContext = createContext<Auth>(
    {} as Auth
);

export const AuthProvider: React.FC = ({children}) => {
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        console.log('Logged in as ' + id)

        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Logged in as ' + user.uid)
                setId(user.uid);
            } else {
                setId(null);
            }
        })
    })

    if (!id) {
        return <Login/>
    }

    return <AuthContext.Provider value={{userId: id}}>
        {children}
    </AuthContext.Provider>
}