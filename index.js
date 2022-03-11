import Http from './xhr';
import {
  NFTStorage,
  Blob
} from'nft.storage';

class IPFSStorageManager {
  constructor(apiKey) {
    if (apiKey) {
      this.client = new NFTStorage({ token: apiKey });
      this.http = new Http();
      this.http.host = 'https://ipfs.io/ipfs/';
    } else throw new Error('nft.storage apiKey must be provided');
  }

  /**
   * Upload any File
   */
  upload(file) {
    return this.client.storeDirectory([file]);
  }

  /**
   * Store a Data Blob like JSON
   */
  storeDataBlob(metadata) {
    const content = new Blob([metadata]);
    return this.client.storeBlob(content);
  }

  delete(cid) {
    return this.client.delete(cid);
  }

  createNFTMetaDataTemplate(description, externalUrl, name, image, attributes) {
    return JSON.stringify({
      description,
      external_url: externalUrl,
      image,
      name,
      attributes
    });
  }

  uploadAndGenerateMetaData(file, description, name, attributes, externalUrl, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const imageFile = new File([file], `${name}.png`, { type });
        const metadata = await client.store({
          name,
          description,
          image: imageFile,
          externalUrl,
          attributes
        });

        return resolve(metadata);
      } catch (e) {
        return reject(e);
      }
    });
  }

  deleteMetaData(cid, cb) {
    return new Promise(async (resolve, reject) => {
      try {
        const { image } = await this.http.get(cid);

        if (image) {
          await this.delete(image.split('/')[4]);
          if (cb) cb(0.5);
        }

        await this.delete(cid);
        if (cb) cb(1);
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  }
}

export default IPFSStorageManager;
