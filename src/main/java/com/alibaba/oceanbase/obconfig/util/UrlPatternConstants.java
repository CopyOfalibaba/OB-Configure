/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.util;

/**
 * 
 * @author liangjie.li
 * @version $Id: UrlPatternConstants.java, v 0.1 Jan 23, 2013 3:34:26 PM liangjie.li Exp $
 */
public class UrlPatternConstants {

    public static final String HOME_VIEW            = "/";

    public static final String CONFIG_DATA          = "/ob-config/config";
    public static final String CONFIG_DATA_LIST     = "/configdata/list";
    public static final String CONFIG_DATA_LIST_PRO = "/config_data/list_pro";
    public static final String CONFIG_DATA_GET_MD5  = "/config_data/get_md5";
    public static final String CONFIG_DATA_JSON     = "/configdata/json";
    public static final String CONFIG_DATA_DELETE   = "/configdata/delete";
    public static final String CONFIG_DATA_ROLLBACK = "/configdata/rollback";
    public static final String CLIENT_STATUS_LIST   = "/clientstatus/list";
    public static final String ENCODE_PASS          = "/configdata/encodepass";

    public static final String JAR_LIST             = "/jarrepo/list";
    public static final String JAR_LIST_VERSION     = "/jarrepo/list_version";
    public static final String JAR_GET              = "/jarrepo/get";
    public static final String JAR_UPDATE           = "/jarrepo/update";
    public static final String JAR_ADD              = "/jarrepo/add";
    public static final String JAR_DELETE           = "/jarrepo/delete";

    private UrlPatternConstants() {
    }
}