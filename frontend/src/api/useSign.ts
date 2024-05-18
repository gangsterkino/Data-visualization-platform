import axios from 'axios'
import { ref, type Ref } from 'vue'
import { type signUpData, type signInData} from '@/types'

const SIGN_API = 'http://127.0.0.1:8001/appDemo/sign'

export function useSign(){
    async function checkEmail(signUpData: signUpData){
        try{
            const response = await axios.post(`${SIGN_API}/check_email/`, {
                email: signUpData.email,
            },{
                withCredentials: true // allowed cookies
            })
            return response.data
        } catch(e){
            throw e
        }
    }

    async function VerifyCode(signUpData: signUpData){
        try{
            const response = await axios.post(`${SIGN_API}/check_v_code/`, {
                v_code: signUpData.verificationCode,
            },{
                withCredentials: true // allowed cookies
            }
            )
            return response.data
        } catch(e){
            throw e
        }
    }

    async function SignUpUser(signUpData: signUpData){
        try{
            const response = await axios.post(`${SIGN_API}/register_user/`, {
                email: signUpData.email,
                password: signUpData.password
            }, {
                withCredentials: true
            })
            return response.data
        } catch(e) {
            throw e
        }
    }

    async function SignInUser(signInData: signInData){
        try{
            const response = await axios.post(`${SIGN_API}/login_user/`, {
                email: signInData.email,
                password: signInData.password
            }, {
                withCredentials: true
            })
            return response.data
        } catch(e){
            throw e
        }
    }

    return {checkEmail, VerifyCode, SignUpUser, SignInUser}

}