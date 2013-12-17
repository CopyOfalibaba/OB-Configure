/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.dao;

import com.alibaba.oceanbase.obconfig.entity.ConfigDataHistoryDO;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: ConfigDataHistoryDAO.java, v 0.1 2013-3-25 ÏÂÎç2:03:11 liangjie.li Exp $
 */
public interface ConfigDataHistoryDAO extends BaseDAO<ConfigDataHistoryDO> {

    /**
     * 
     * 
     * @param dataId
     * @return
     */
    public ConfigDataHistoryDO findLatestRecordByDataId(String dataId);

    /**
     * 
     * 
     * @param dataId
     * @param version
     * @return
     */
    public ConfigDataHistoryDO exist(String dataId, String version);

}
