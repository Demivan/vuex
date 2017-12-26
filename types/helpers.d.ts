import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => (Promise<any> | void);

type Unionize<T> = {[P in keyof T]: {[Q in P]: T[P]}}[keyof T];

interface Mapper<R> {
  <T extends Dictionary<R>, K extends keyof T>(map: K[]): Pick<T, K>;
  <T extends Dictionary<R>, K extends keyof T>(map: Dictionary<K>): Pick<T, K>;
}

interface MapperWithNamespace<R> {
  <T extends Dictionary<R>, K extends keyof T>(namespace: string, map: K[]): Pick<T, K>;
  <T extends Dictionary<R>, K extends keyof T>(namespace: string, map: Dictionary<K>): Pick<T, K>;
}

interface FunctionMapper<F, R> {
  <T extends Dictionary<R>, K extends keyof T>(map: T): Unionize<{[key in K]: (this: typeof Vue, fn: F, ...args: any[]) => any}>;
}

interface FunctionMapperWithNamespace<F, R> {
  <T extends Dictionary<R>, K extends keyof T>(
    namespace: string,
    map: T
  ): Unionize<{[key in K]: (this: typeof Vue, fn: F, ...args: any[]) => any}>;
}

interface MapperForState {
  <S>(
    map: Dictionary<(this: typeof Vue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
}

interface MapperForStateWithNamespace {
  <S>(
    namespace: string,
    map: Dictionary<(this: typeof Vue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
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
