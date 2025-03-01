import RocksDB from 'rocksdb';

const db = new RocksDB('./db');

export const openDB = () => {
    return new Promise((resolve, reject) => {
        db.open((err) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
};

export const closeDB = () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

export const put = (key, value) => {
    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

export const get = (key) => {
    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) return reject(err);
            resolve(value);
        });
    });
};

export const del = (key) => {
    return new Promise((resolve, reject) => {
        db.del(key, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};