/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.util;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: MD5Calculator.java, v 0.1 2013-3-26 ÉÏÎç10:10:19 liangjie.li Exp $
 */
public class MD5Calculator {

    /**
     * 
     * 
     * @param is
     * @return
     * @throws NoSuchAlgorithmException
     * @throws IOException
     */
    public static String calcuateJarFromInputStream(InputStream is)
                                                                   throws NoSuchAlgorithmException,
                                                                   IOException {
        MessageDigest md = MessageDigest.getInstance("MD5");

        byte[] buffer = new byte[1024];
        int numRead = 0;
        do {
            numRead = is.read(buffer);
            if (numRead > 0) {
                md.update(buffer, 0, numRead);
            }
        } while (numRead != -1);

        byte[] digest = md.digest();
        BigInteger bigInt = new BigInteger(1, digest);
        return bigInt.toString(16);
    }

    /**
     * 
     * 
     * @param buffer
     * @return
     * @throws NoSuchAlgorithmException
     */
    public static String calcuateJarFromBytes(byte[] buffer) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(buffer, 0, buffer.length);

        byte[] digest = md.digest();
        BigInteger bigInt = new BigInteger(1, digest);
        return bigInt.toString(16);
    }

    private MD5Calculator() {
    }
}
