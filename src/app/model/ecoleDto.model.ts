import { Localisation } from "./localisation.model";
export interface EcoleDto{
    nom: string;
    tel: number
    adresse: {commune:string,departement:string}
    geoLocalisation:Localisation
    link: string;
}
