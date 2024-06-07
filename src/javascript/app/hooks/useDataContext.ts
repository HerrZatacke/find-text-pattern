import { useContext } from 'react';
import { dataContext } from '../components/structure/DataProvider';
import type { GlobalData } from '../components/structure/DataProvider';


export const useDataContext = (): GlobalData => useContext<GlobalData>(dataContext);
