export type QuestionnaireEntity = {
    id: string,
    name: string,
    image: string,
    quantity: number,
    endDate: string,
    link: string,
    exceedsQuantity: boolean,
    canBeOnline: boolean,
    isActive: boolean,
    appliers: {
            id: string,
            name: string,
            isActive: boolean
        }[],
    devices:{
            id: string,
            name: string,
            pin: string,
            isActive: boolean
        }[]
}