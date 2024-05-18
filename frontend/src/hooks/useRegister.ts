import { ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'
import { type signUpData} from '@/types'
import {useSign} from '@/api/useSign'

export function useRegister() {
    const signUp = ref(false)
    const signUpStep = ref(1)
    const signUpData: Ref<signUpData> = ref({
        email: '',
        verificationCode: '',
        password: '',
        confirmPassword: '',
        prompt: '',
    })

    const {checkEmail, VerifyCode, SignUpUser} = useSign()

    function beginRegistrate(){
        signUp.value = true
        resetRegistration()
    }

    async function goToNextStep() {
        if(signUpStep.value == 1){
            checkEmail(signUpData.value)
            signUpStep.value ++
        }
        else if(signUpStep.value == 2){
            let response = await VerifyCode(signUpData.value)
            if(response.pass == 1){
                signUpStep.value ++
            }    
        }
        else if(signUpStep.value == 3){
            if(signUpData.value.password == signUpData.value.confirmPassword){
                const response = await SignUpUser(signUpData.value)
                console.log(response)
                signUp.value = false
            }    
            else{
                signUpData.value.prompt = '两次密码不一致!'
            }
        }
    }

    function goToPreviousStep() {
        signUpStep.value --
    }

    function resetRegistration(){
        signUpStep.value = 1
        signUpData.value = {
            email: '',
            verificationCode: '',
            password: '',
            confirmPassword: '',
            prompt: '',
        }
    }

    return {signUp, signUpStep, signUpData, 
        beginRegistrate, goToNextStep, goToPreviousStep, resetRegistration}
}