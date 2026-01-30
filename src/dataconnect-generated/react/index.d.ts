import { CreateUserData, CreateUserVariables, ListProductsData, AddToCartData, AddToCartVariables, GetUserCartData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useListProducts(options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;
export function useListProducts(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;

export function useAddToCart(options?: useDataConnectMutationOptions<AddToCartData, FirebaseError, AddToCartVariables>): UseDataConnectMutationResult<AddToCartData, AddToCartVariables>;
export function useAddToCart(dc: DataConnect, options?: useDataConnectMutationOptions<AddToCartData, FirebaseError, AddToCartVariables>): UseDataConnectMutationResult<AddToCartData, AddToCartVariables>;

export function useGetUserCart(options?: useDataConnectQueryOptions<GetUserCartData>): UseDataConnectQueryResult<GetUserCartData, undefined>;
export function useGetUserCart(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserCartData>): UseDataConnectQueryResult<GetUserCartData, undefined>;
