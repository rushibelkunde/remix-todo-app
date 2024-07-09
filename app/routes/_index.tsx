import { redirect } from "@remix-run/react"

export const loader = async()=>{

    return redirect('/home')
}