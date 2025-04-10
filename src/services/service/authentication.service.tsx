import axiosInstance from "../axios.setup";

interface AuthDataProps {
    username: string,
    password: string
}

interface RegisterProps {
    id: number,
    username: string,
    email: string,
    password: string

}
class AuthenticationService {
    Login = async (data: AuthDataProps) => {
        const respose = await axiosInstance.post('/auth/login', data)
        return respose.data
    }

    Register = async (data: RegisterProps) => {
        const response = await axiosInstance.post('/users', data)
        return response.data
    }

    
}

const AuthenticationServiceInstance = new AuthenticationService()
export default AuthenticationServiceInstance;