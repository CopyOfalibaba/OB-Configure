package com.alibaba.oceanbase.obconfig.util;

/**
 * 
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: Constants.java, v 0.1 Jan 23, 2013 3:01:23 PM liangjie.li Exp $
 */
public class Constants {
    public static final int    ACTIVE_STATUS                            = 0;
    public static final int    INACTIVE_STATUS                          = 1;

    public static final int    HOST                                     = 0;
    public static final int    GROUP                                    = 1;
    public static final int    ALL                                      = 2;

    public static final String SESSION_USER                             = "user";

    public static final String ALGORITHM                                = "MD5";
    public static final String DEFAULT_SSO_USER_PWD                     = "obmonitor";

    public static final String OPERATE_INSERT                           = "insert";
    public static final String OPERATE_UPDATE                           = "update";
    public static final String OPERATE_DELETE                           = "delete";

    public static final String ITEM_TYPE_NONE                           = "none";
    public static final String ITEM_TYPE_EXPRESS                        = "express";
    public static final String ITEM_TYPE_ALL                            = "all";
    public static final String ITEM_TYPE_AVG                            = "avg";

    public static final String ALL_SERVER_STAT                          = "select * from __all_server_stat";
    public static final String ALL_CLUSTER                              = "select cluster_id, cluster_vip, cluster_port, cluster_role from __all_cluster";
    public static final String ALL_SERVER                               = "select cluster_id, svr_type, svr_ip, svr_port, inner_port from __all_server";
    public static final String ALL_SERVER_BY_CLUSTER_ID                 = "select cluster_id, svr_type, svr_ip, svr_port, inner_port from __all_server where cluster_id = ?";
    public static final String ALL_SERVER_BY_CLUSTER_ID_ADN_SERVER_TYPE = "select svr_type, svr_ip, svr_port from __all_server where svr_type = ? and cluster_id = ?";
    public static final String ALL_CLIENT                               = "select gm_create, gm_modify, client_ip, version from __all_client";

    public static void main(String[] args) {
        System.out.println(ALL_SERVER_BY_CLUSTER_ID_ADN_SERVER_TYPE.replaceFirst("\\?",
            "updateserver").replaceFirst("\\?", "1"));
    }

    private Constants() {
    }
}
