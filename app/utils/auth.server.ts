import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from 'bcryptjs'
import { db } from "./db.server";


const authenticator = new Authenticator(sessionStorage)

const formStrategy = new FormStrategy(async ({form})=>{

    const name = form.get('name')
    const username = form.get('username')
    const pass = form.get('password')

    const user = await db.user.findUnique({
        where:{
            username : username as string
        }
    })

    if(!user){
        throw new AuthorizationError("user don't exist")

    }
    const passwordMatch = await bcrypt.compare(pass as string, user.pass as string)

    if(!passwordMatch) throw new AuthorizationError("invalid credentials")

    return user

})

authenticator.use(formStrategy, 'form')

export {authenticator}

