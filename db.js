import RocksDB from 'rocksdb';

const db = new RocksDB('./db');

export const openDB = () => {
    return new Promise((resolve, reject) => {
      db.open({ createIfMissing: true }, (err) => {
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

export const addActivityKey = async (key) => {
    try {
      // Busca a lista de chaves existente (ou cria uma nova se não existir)
      const activityKeys = await get('activityKeys').catch(() => '[]'); // Se não existir, retorna '[]'
      const keys = JSON.parse(activityKeys); // Converte a string JSON para array
      keys.push(key); // Adiciona a nova chave
      await put('activityKeys', JSON.stringify(keys)); // Salva a lista atualizada
    } catch (error) {
      console.error('Erro ao adicionar chave de atividade:', error);
      throw error; // Propaga o erro para ser tratado no chamador
    }
};
  
export const getActivityKeys = async () => {
    const activityKeys = await get('activityKeys');
    return activityKeys ? JSON.parse(activityKeys) : [];
};