import dbConnect from '@/lib/dbConnect';
import { verificationEmail } from '@/lib/resend';
import userModel from '@/models/user.model';
import bcrypt from "bcryptjs"
import { verify } from 'crypto';


export const POST = async (request: Request) => {
    await dbConnect()
    try {
        const { username, email, password } = await request.json();

        //case 1: checking if username is already exist and verified
        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        console.log(existingUserVerifiedByUsername, "existingUserVerifiedByUsername");
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username already exist"
            },
                {
                    status: 400
                })
        }

        // step 2: it has two case. 1. user exist but not verified 2. new user

        const exisitingUserByEmail = await userModel.find({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // please check 
        console.log(exisitingUserByEmail, "exisitingUserByEmail");


        if (exisitingUserByEmail.length > 0) {
            const existingUser = exisitingUserByEmail[0];
            if (existingUser.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Username already exists.",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUser.verifyCode = verifyCode;
                existingUser.password = hashedPassword;
                await existingUser.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const codeExpiry = new Date();
            codeExpiry.setHours(codeExpiry.getHours() + 1)

            console.log(hashedPassword, "hashpass");
            const newUser = await new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: codeExpiry,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save() // because it return promise

            // send verification email
            const emailResponse = await verificationEmail(username, email, verifyCode);

            if (!emailResponse.success) {
                return Response.json({
                    message: emailResponse.message,
                    usccess: false
                }, {
                    status: 500
                })
            }
            return Response.json({
                message: "User create successfully. please check your email to verify",
                usccess: true
            }, {
                status: 500
            })
        }
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                success: false,
                message: "error registration ",
            },
            {
                status: 500
            }
        )
    } finally {
        return {
            success: true,
            message: "Success",
        }
    }
}