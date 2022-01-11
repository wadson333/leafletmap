import { Localisation } from "./localisation.model";

export interface DirectionModel{
    depart:Localisation,
    destination:Localisation,
    transportType:string
}