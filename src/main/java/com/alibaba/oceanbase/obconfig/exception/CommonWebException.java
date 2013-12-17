/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.exception;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: CommonWebException.java, v 0.1 Jan 23, 2013 3:34:39 PM liangjie.li Exp $
 */
public class CommonWebException extends RuntimeException {
    /**
    * @FieldsserialVersionUID:TODO
    */
    private static final long serialVersionUID = -8310554541770582275L;

    public CommonWebException() {
        super();
    }

    public CommonWebException(String message) {
        super(message);
    }

    public CommonWebException(String message, Throwable cause) {
        super(message, cause);
    }

    public CommonWebException(Throwable e) {
        this(e.getMessage(), e);
    }
}
