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

interface MapperWithFunc<R, TMapFunc> {
  <T extends Dictionary<string>, K extends keyof T>(map: K[]): UnionizeDict<K, R>;
  <T extends Dictionary<string|TMapFunc>, K extends keyof T>(map: T): UnionizeDict<K, R>;
}

interface MapperWithNamespace<R> {
  <T extends Dictionary<string>, K extends keyof T>(namespace: string, map: K[]): UnionizeDict<K, R>;
  <T extends Dictionary<string>, K extends keyof T>(namespace: string, map: T): UnionizeDict<K, R>;
}

interface MapperWithFuncWithNamespace<R, TMapFunc> {
  <T extends Dictionary<string>, K extends keyof T>(namespace: string, map: K[]): UnionizeDict<K, R>;
  <T extends Dictionary<string|TMapFunc>, K extends keyof T>(namespace: string, map: T): UnionizeDict<K, R>;
}

type GenericMapFunction<F> = (this: typeof Vue, fn: F, ...args: any[]) => any
type StateMapFunction = <S>(this: typeof Vue, state: S, getters: any) => any

interface NamespacedMappers {
  mapState: MapperWithFunc<Computed, StateMapFunction>;
  mapMutations: MapperWithFunc<MutationMethod, GenericMapFunction<Commit>>;
  mapGetters: Mapper<Computed>;
  mapActions: MapperWithFunc<ActionMethod, GenericMapFunction<Dispatch>>;
}

export declare const mapState: MapperWithFunc<Computed, StateMapFunction>
  & MapperWithFuncWithNamespace<Computed, StateMapFunction>;

export declare const mapMutations: MapperWithFunc<MutationMethod, GenericMapFunction<Commit>>
  & MapperWithFuncWithNamespace<MutationMethod, GenericMapFunction<Commit>>;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: MapperWithFunc<ActionMethod, GenericMapFunction<Dispatch>>
  & MapperWithFuncWithNamespace<ActionMethod, GenericMapFunction<Dispatch>>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;
