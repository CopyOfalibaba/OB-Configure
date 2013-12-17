/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.dao.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.alibaba.oceanbase.obconfig.dao.JarDAO;
import com.alibaba.oceanbase.obconfig.entity.JarDO;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: JarDAOImpl.java, v 0.1 2013-3-22 ÏÂÎç12:27:55 liangjie.li Exp $
 */
public class JarDAOImpl extends SqlMapClientDaoSupport implements JarDAO {

    /**  */
    private static final long serialVersionUID = 2560855909499037673L;

    public JarDO insert(JarDO t) {
        this.getSqlMapClientTemplate().insert("jar_insert", t);
        return t;
    }

    public int delete(JarDO t) {
        if (t != null && t.getId() > 0) {
            return this.deleteById(t.getId());
        }
        return 0;
    }

    public int deleteById(int id) {
        return this.getSqlMapClientTemplate().delete("jar_delete", id);
    }

    public int update(JarDO t) {
        if (t != null && StringUtils.isNotBlank(t.getJarFileName())) {
            return this.getSqlMapClientTemplate().update("jar_update", t);
        }
        return this.getSqlMapClientTemplate().update("jar_update_version", t);
    }

    public JarDO findById(int id) {
        return (JarDO) this.getSqlMapClientTemplate().queryForObject("jar_select_bykey", id);
    }

    public int saveOrUpdate(JarDO t) {
        if (t != null && t.getId() > 0) {
            return this.update(t);
        } else if (t != null) {
            return this.insert(t).getId();
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    public List<JarDO> findAll() {
        return this.getSqlMapClientTemplate().queryForList("jar_select_all");
    }

    public JarDO findByVersion(String version) {
        return (JarDO) this.getSqlMapClientTemplate().queryForObject("jar_select_byversion",
            version);
    }

    @SuppressWarnings("unchecked")
    public List<String> findAllVersion() {
        return this.getSqlMapClientTemplate().queryForList("jar_select_all_version");
    }

}
