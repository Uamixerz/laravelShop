export interface ICategoryCreate {
    name: string,
    image: File|null,
    description: string
}
export interface ICategoryCreateError {
    name: string,
    description: string,
    image: string
}