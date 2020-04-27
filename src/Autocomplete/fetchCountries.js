import {countries} from './countries';

export const fetchCountries = ({value, onSuccess}) => {
    const result = countries.filter(option => option.toLowerCase().includes(value.toLowerCase()));

    setTimeout(() => onSuccess(result), 500);
}