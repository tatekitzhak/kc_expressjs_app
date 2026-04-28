export interface User {
    username: string,
    email: string,
    password: string
}

export interface UnitUser extends User {
    id: string
}

export interface Users {
    [key: string]: UnitUser
}

export interface EnumServiceGetOrderBy {
    [index: number]: { id: number; email: string; name: string };
}

export interface EnumServiceItems extends Array<EnumServiceGetOrderBy> {
    id: string
}

export interface RedisSet {
    EX: number;// the specified expire time in seconds
    PX?: number; // the specified expire time in milliseconds
    EXAT?: number; // the specified Unix time at which the key will expire, in seconds
    PXAT?: number; // the specified Unix time at which the key will expire, in milliseconds
    NX?: boolean; // write the data only if the key does not already exist
    XX?: number; // write the data only if the key already exists
    KEEPTTL?: number; // retain the TTL associated with the key
    GET?: string; // return the old string stored at key, or "undefined" if key did not exist
}

export interface RedisSetOptions {
    [key: string]: RedisSet
}
