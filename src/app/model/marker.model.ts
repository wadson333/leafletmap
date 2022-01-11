import { EcoleDto } from '../model/ecoleDto.model';
import { CurrentPlace } from './currentplace.model';

export interface MarkerModel{
    ecole?:EcoleDto;
    currentPlace?:CurrentPlace
    type:number
}