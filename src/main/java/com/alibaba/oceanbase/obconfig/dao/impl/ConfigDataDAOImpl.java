package com.alibaba.oceanbase.obconfig.dao.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.alibaba.oceanbase.obconfig.dao.ConfigDataDAO;
import com.alibaba.oceanbase.obconfig.entity.ConfigDataDO;

/**
 * 
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: ConfigDataDAOImpl.java, v 0.1 Feb 18, 2013 3:15:47 PM liangjie.li Exp $
 */
public class ConfigDataDAOImpl extends SqlMapClientDaoSupport implements ConfigDataDAO {

    /**  */
    private static final long serialVersionUID = 7281486587274810199L;

    @Override
    public ConfigDataDO insert(ConfigDataDO t) {
        this.getSqlMapClientTemplate().insert("configdata_insert", t);
        return t;
    }

    @Override
    public int delete(ConfigDataDO t) {
        if (t != null && StringUtils.isNotBlank(t.getDataId())) {
            return this.deleteById(t.getDataId());
        }
        return 0;
    }

    @Override
    public int deleteById(int id) {
        throw new RuntimeException("not support operation!");
    }

    @Override
    public int deleteById(String id) {
        return this.getSqlMapClientTemplate().delete("configdata_delete", id);
    }

    @Override
    public int update(ConfigDataDO t) {
        return this.getSqlMapClientTemplate().update("configdata_update", t);
    }

    @Override
    public ConfigDataDO findById(int id) {
        throw new RuntimeException("not support operation!");
    }

    @Override
    public ConfigDataDO findById(String id) {
        return (ConfigDataDO) this.getSqlMapClientTemplate().queryForObject(
            "configdata_select_byid", id);
    }

    @Override
    public int saveOrUpdate(ConfigDataDO t) {
        ConfigDataDO configDataDO = this.findById(t.getDataId());
        if (configDataDO == null) { // insert
            this.insert(t);
            return 100;
        } else {
            return this.update(t);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<ConfigDataDO> findAll() {
        return this.getSqlMapClientTemplate().queryForList("configdata_select_bycondition");
    }

}
