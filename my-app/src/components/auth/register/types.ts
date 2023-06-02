export interface IRegister {
    email: string,
    password: string,
    name: string,
    lastName:string,
    phone:string,
    confirmPassword:string,
    image: File | null
}
