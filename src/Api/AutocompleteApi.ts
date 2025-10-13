import { createApi } from "@reduxjs/toolkit/query/react";


import type { OptionType, QueryParamsType } from "../Dto/formDto";
import APIFetchBase from "../Store/ApiConfig";


export const autocompleteApi = createApi({
  reducerPath: "autocompleteApi",
  baseQuery: APIFetchBase,
  tagTypes: ["AutoCompleteApi"],
keepUnusedDataFor: 300,
  endpoints: (builder) => ({    
    autocompletedata: builder.query<
     OptionType[] ,
      { params: QueryParamsType; baseurl?: string }
    >({
      query: (args) => {
        return {
          method: "GET",
          url: args.baseurl ? args.baseurl : "/dictionary",
          params: {
            ...args?.params,
          },
       
        };
        
      },
      keepUnusedDataFor: 5,
    }),
   }),
});

export const {
 
  useAutocompletedataQuery,
 
} = autocompleteApi;
