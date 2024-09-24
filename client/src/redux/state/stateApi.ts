import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

import {UserEmail} from "./state";

interface AddUserEmailQueryResponse {
  message: string;
}
interface unsubscribeMutationRequest {
  id: string;
}

interface unsubscribeMutationResponse {
  message: string;
}
export const api = createApi({
  baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses"],
  endpoints: (build) => ({
    addUserEmail: build.mutation<AddUserEmailQueryResponse, UserEmail>({
      query: (userEmail) => ({
        url: "/addEmail",
        method: "post",
        body: userEmail,
      }),
      invalidatesTags: [],
    }),
    unsubscribe: build.mutation<
      unsubscribeMutationResponse,
      unsubscribeMutationRequest
    >({
      query: (unsubscribeMutationRequest) => ({
        url: "/unsubscribe",
        method: "post",
        body: unsubscribeMutationRequest,
      }),
      invalidatesTags: [], // this line means that after the new product is created the tags will become invalidate and a new api call will be made to get the fresh list of products.
    }),
  }),
});

export const {useAddUserEmailMutation, useUnsubscribeMutation} = api;
