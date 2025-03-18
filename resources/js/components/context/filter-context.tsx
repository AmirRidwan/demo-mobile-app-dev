import { createContext, SetStateAction } from 'react';

export type FilterContextType = {
    filter: string;
    setFilter: React.Dispatch<SetStateAction<string>>;
};

export const FilterContext = createContext<FilterContextType>({
    filter: '',
    setFilter: () => {},
});
