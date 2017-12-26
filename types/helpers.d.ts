import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => Promise<any>;

type Unionize<T> = {[P in keyof T]: {[Q in P]: T[P]}}[keyof T];
type UnionizeDict<Key extends string, Value> = Unionize<{[key in Key]: Value}>

interface Mapper<R> {
  <T extends Dictionary<string>, K extends keyof T>(map: K[]): UnionizeDict<K, R>;
  <T extends Dictionary<string>, K extends keyof T>(map: T): UnionizeDict<K, R>;
}

interface MapperWithNamespace<R> {
  <T extends Dictionary<string>, K extends keyof T>(namespace: string, map: K[]): UnionizeDict<K, R>;
  <T extends Dictionary<string>, K extends keyof T>(namespace: string, map: T): UnionizeDict<K, R>;
}

interface FunctionMapper<F, R> {
  <T extends Dictionary<(this: typeof Vue, fn: F, ...args: any[]) => any>, K extends keyof T>(map: T): Unionize<{[key in K]: R}>;
}

interface FunctionMapperWithNamespace<F, R> {
  <T extends Dictionary<(this: typeof Vue, fn: F, ...args: any[]) => any>, K extends keyof T>(
    namespace: string,
    map: T
  ): Unionize<{[key in K]: R}>;
}

interface MapperForState {
  <S, T extends Dictionary<(this: typeof Vue, state: S, getters: any) => any>, K extends keyof T>(
    map: T
  ): Unionize<{[key in K]: Computed}>;
}

interface MapperForStateWithNamespace {
  <S, T extends Dictionary<(this: typeof Vue, state: S, getters: any) => any>, K extends keyof T>(
    namespace: string,
    map: T
  ): Unionize<{[key in K]: Computed}>;
}

interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod> & FunctionMapper<Commit, MutationMethod>;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod> & FunctionMapper<Dispatch, ActionMethod>;
}

export declare const mapState: Mapper<Computed>
  & MapperWithNamespace<Computed>
  & MapperForState
  & MapperForStateWithNamespace;

export declare const mapMutations: Mapper<MutationMethod>
  & MapperWithNamespace<MutationMethod>
  & FunctionMapper<Commit, MutationMethod>
  & FunctionMapperWithNamespace<Commit, MutationMethod>;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: Mapper<ActionMethod>
  & MapperWithNamespace<ActionMethod>
  & FunctionMapper<Dispatch, ActionMethod>
  & FunctionMapperWithNamespace<Dispatch, ActionMethod>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;
