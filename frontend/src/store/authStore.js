import {create} from "zustand"
import axios from "axios"

const serverUrl = 'http://localhost:5000/api/auth';
axios.defaults.withCredentials = true;
export const useAuthStore = create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:'',

    signup : async(email,password,name)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/signup`,{email,password,name});
            set({
                user:response.data.user,
                isAuthenticated:true,
                isLoading:false,
            })
        } catch (error) {
            set({
                error:error.response.data.message || "Error in Signing up ",isLoading:false
            });
            throw error;
        }
    },

    verifyEmail : async(code)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/verify-email`,{code});
            set({
                user:response.data.user,
                isAuthenticated:true,
                isLoading:false,
            });
            return response.data
        } catch (error) {
            set({
                error:error.response.data.message || "Error in Verify Email function ",isLoading:false
            });
            throw error;
        }
    },
    checkAuth: async () => {
        set({isCheckingAuth:true,error:null})
        try {
            const response = await axios.get(`${serverUrl}/check-auth`);
            set({
                user:response.data.user,
                isAuthenticated:true,
                isCheckingAuth:false
            });
            return response.data
        } catch (error) {
            set({
                error:null,
                isCheckingAuth:false,
                isAuthenticated:false,
            });
            throw error;
        }
    },
    login : async(email,password)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/login`,{email,password});
            set({
                user:response.data.user,
                isAuthenticated:true,
                isLoading:false,
            })
        } catch (error) {
            set({
                error:error.response.data.message || "Error in Login ",isLoading:false
            });
            throw error;
        }
    },

    logout : async()=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/logout`);
            set({
                user:null,
                isAuthenticated:false,
                isLoading:false,
                error:null
            })
        } catch (error) {
            set({
                error:error.response.data.message || "Error in Logout ",isLoading:false
            });
            throw error;
        }
    },

    forgotPassword: async(email)=>{
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/forgot-password`,{email});
            set({
                isLoading:false,
                message:response.data.message
            })
        } catch (error) {
            set({
                error:response.data.message || "Error in forgotPassword ",isLoading:false
            });
            throw error;
        }
    },
    resetPassword: async (token,password) => {
        set({isLoading:true,error:null})
        try {
            const response = await axios.post(`${serverUrl}/reset-password/${token}`,{password});
            set({isLoading:false,error:null,message:response.data.message});
        } catch (error) {
            set({
                error:response.data.message || "Error in ResetPassword ",isLoading:false
            });
            throw error;
        }
    }

}))
