/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.dao.impl;

import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.alibaba.oceanbase.obconfig.dao.ConfigDataHistoryDAO;
import com.alibaba.oceanbase.obconfig.entity.ConfigDataHistoryDO;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: ConfigDataHistoryDAOImpl.java, v 0.1 2013-3-25 ÏÂÎç2:06:14 liangjie.li Exp $
 */
public class ConfigDataHistoryDAOImpl extends SqlMapClientDaoSupport implements
                                                                    ConfigDataHistoryDAO {

    /**  */
    private static final long serialVersionUID = 3198140431948869364L;

    public ConfigDataHistoryDO insert(ConfigDataHistoryDO t) {
        if (t != null) {
            this.getSqlMapClientTemplate().insert("configdatahistory_insert", t);
        }
        return t;
    }

    public ConfigDataHistoryDO findLatestRecordByDataId(String dataId) {
        @SuppressWarnings("unchecked")
        List<ConfigDataHistoryDO> list = this.getSqlMapClientTemplate().queryForList(
            "configdatahistory_select_bycondition", dataId);
        if (list.size() >= 2) {
            return list.get(1);
        } else {
            return list.get(0);
        }
    }

    public ConfigDataHistoryDO exist(String dataId, String version) {
        return (ConfigDataHistoryDO) this.getSqlMapClientTemplate().queryForObject(
            "configdatahistory_exist");
    }

    public int delete(ConfigDataHistoryDO t) {
        throw new UnsupportedOperationException();
    }

    public int deleteById(int id) {
        throw new UnsupportedOperationException();
    }

    public int update(ConfigDataHistoryDO t) {
        throw new UnsupportedOperationException();
    }

    public ConfigDataHistoryDO findById(int id) {
        throw new UnsupportedOperationException();
    }

    public int saveOrUpdate(ConfigDataHistoryDO t) {
        throw new UnsupportedOperationException();
    }

}
