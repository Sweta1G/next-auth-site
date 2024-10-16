/* eslint-disable @typescript-eslint/no-explicit-any */
import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bycryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect()
export async function POST(request: NextRequest){
    try{
        const reqBody= await request.json()
        const {email,password}= reqBody;
        // Validation;
        console.log(reqBody)

        const user= await User.findOne({email});

        if(!user){
            return NextResponse.json({error:"User Doesnt Exists"},{status:400})
            
        }
        console.log("User Exists");
        const validPassword= await bycryptjs.compare(password,user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid Credentials"},{status:400})
        }
        console.log(user);

        const tokenData={
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token= jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
        const response= NextResponse.json({
            message : "Login Success",
            success: true
        })

        response.cookies.set("token",token,{httpOnly : true})
        return response

    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}