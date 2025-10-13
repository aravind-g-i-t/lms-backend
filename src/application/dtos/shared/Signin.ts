export interface UserSigninInputDTO {
    role:'learner'|'instructor'|'business'
    email: string;
    password: string;
}

export interface UserForSignin {
    id: string;
    name: string;
    profilePic: string | null;
}

export interface UserSigninOutputDTO {
    user: UserForSignin;
    accessToken: string;
    refreshToken: string;
    role: 'learner' | 'instructor' | 'business'
}