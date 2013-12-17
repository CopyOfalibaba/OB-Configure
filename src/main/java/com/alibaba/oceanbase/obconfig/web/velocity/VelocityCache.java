/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web.velocity;

import java.util.HashMap;
import java.util.Map;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: VelocityCache.java, v 0.1 Jan 23, 2013 3:29:13 PM liangjie.li Exp $
 */
public class VelocityCache {

    private static Map<String, Boolean> velocityCache = new HashMap<String, Boolean>();

    public static Boolean hasLayout(String path) {
        return velocityCache.get(path);
    }

    public static void markLayoutExist(String layoutPath) {
        velocityCache.put(layoutPath, Boolean.TRUE);
    }

    public static void markLayoutNonExist(String layoutPath) {
        velocityCache.put(layoutPath, Boolean.FALSE);
    }

}
