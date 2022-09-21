// import CryptoJS from "crypto-js";

import AES from "crypto-js/aes";
import EncUtf8 from "crypto-js/enc-utf8";
import PadPkcs7 from "crypto-js/pad-pkcs7"
import EncBase64 from "crypto-js/enc-base64"
import EncHex from "crypto-js/enc-hex"

import modeCBC from "crypto-js/mode-cfb"


// 十六位十六进制数作为密钥
const SECRET_KEY = EncUtf8.parse("3333e6e110112119");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = EncUtf8.parse("e3bbe7e3ba88866a");


/**
 * 加密方法
 * @param data
 * @returns {string}
 */
 export const encrypt = (data: string) => {
    const dataHex = EncUtf8.parse(data);
    const encrypted = AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: modeCBC,
        padding: PadPkcs7
    });
    return encrypted.ciphertext.toString();
}

/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export const decrypt = (data: string) => {
    const encryptedHexStr = EncHex.parse(data);
    const str = EncBase64.stringify(encryptedHexStr);
    const decrypt = AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: modeCBC,
        padding: PadPkcs7
    });
    const decryptedStr = decrypt.toString(EncUtf8);
    return decryptedStr.toString();
}