package com.alibaba.oceanbase.obconfig.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

/**
 * ¼ÓÃÜÄ£¿é
 * 
 * @author liangjie.li
 * @version $Id: SecureIdentityLoginModule.java, v 0.1 2012-8-8 ÏÂÎç5:12:38 liangjie.li Exp $
 */
public class SecureIdentityLoginModule {

    public static void main(String[] args) throws InvalidKeyException, NoSuchPaddingException,
                                          NoSuchAlgorithmException, BadPaddingException,
                                          IllegalBlockSizeException, UnsupportedEncodingException {
        System.out.println(encode("admin"));
    }

    private static byte[] ENC_KEY_BYTES_PROD = null;

    static {
        try {
            ENC_KEY_BYTES_PROD = "gQzLk5tTcGYlQ47GG29xQxfbHIURCheJ".getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    public static String encode(String secret) throws NoSuchPaddingException,
                                              NoSuchAlgorithmException, InvalidKeyException,
                                              BadPaddingException, IllegalBlockSizeException,
                                              UnsupportedEncodingException {
        return SecureIdentityLoginModule.encode(null, secret);
    }

    public static String encode(String encKey, String secret) throws InvalidKeyException,
                                                             NoSuchAlgorithmException,
                                                             NoSuchPaddingException,
                                                             IllegalBlockSizeException,
                                                             BadPaddingException,
                                                             UnsupportedEncodingException {
        byte[] kbytes = SecureIdentityLoginModule.ENC_KEY_BYTES_PROD;
        if (isNotBlank(encKey)) {
            kbytes = encKey.getBytes("UTF-8");
        }

        return initEncode(kbytes, secret);
    }

    static final String initEncode(byte[] kbytes, String secret) throws NoSuchAlgorithmException,
                                                                NoSuchPaddingException,
                                                                InvalidKeyException,
                                                                IllegalBlockSizeException,
                                                                BadPaddingException,
                                                                UnsupportedEncodingException {
        SecretKeySpec key = new SecretKeySpec(kbytes, "Blowfish");
        Cipher cipher = Cipher.getInstance("Blowfish");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encoding = cipher.doFinal(secret.getBytes("UTF-8"));
        BigInteger n = new BigInteger(encoding);
        return n.toString(16);
    }

    public static char[] decode(String secret) throws NoSuchPaddingException,
                                              NoSuchAlgorithmException, InvalidKeyException,
                                              BadPaddingException, IllegalBlockSizeException,
                                              UnsupportedEncodingException {
        return SecureIdentityLoginModule.decode(null, secret).toCharArray();
    }

    public static String decode(String encKey, String secret) throws NoSuchPaddingException,
                                                             NoSuchAlgorithmException,
                                                             InvalidKeyException,
                                                             BadPaddingException,
                                                             IllegalBlockSizeException,
                                                             UnsupportedEncodingException {

        byte[] kbytes = SecureIdentityLoginModule.ENC_KEY_BYTES_PROD;
        if (isNotBlank(encKey)) {
            kbytes = encKey.getBytes("utf-8");
        }

        return iniDecode(kbytes, secret);
    }

    static final String iniDecode(byte[] kbytes, String secret) throws NoSuchPaddingException,
                                                               NoSuchAlgorithmException,
                                                               InvalidKeyException,
                                                               BadPaddingException,
                                                               IllegalBlockSizeException {
        SecretKeySpec key = new SecretKeySpec(kbytes, "Blowfish");
        BigInteger n = new BigInteger(secret, 16);
        byte[] encoding = n.toByteArray();
        // SECURITY-344: fix leading zeros
        if (encoding.length % 8 != 0) {
            int length = encoding.length;
            int newLength = ((length / 8) + 1) * 8;
            int pad = newLength - length; //number of leading zeros
            byte[] old = encoding;
            encoding = new byte[newLength];
            for (int i = old.length - 1; i >= 0; i--) {
                encoding[i + pad] = old[i];
            }
        }
        Cipher cipher = Cipher.getInstance("Blowfish");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decode = cipher.doFinal(encoding);
        return new String(decode);
    }

    static final boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    static final boolean isBlank(String str) {
        int strLen = 0;
        if (str == null || (strLen = str.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if ((Character.isWhitespace(str.charAt(i)) == false)) {
                return false;
            }
        }
        return true;
    }

}
