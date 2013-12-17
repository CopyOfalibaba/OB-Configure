/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.dao;

import java.util.List;

import com.alibaba.oceanbase.obconfig.entity.JarDO;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: JarDAO.java, v 0.1 2013-3-22 ионГ11:46:18 liangjie.li Exp $
 */
public interface JarDAO extends BaseDAO<JarDO> {

    /**
     * 
     * 
     * @return
     */
    public List<JarDO> findAll();

    /**
     * 
     * 
     * @return
     */
    public List<String> findAllVersion();

    /**
     * 
     * 
     * @param version
     * @return
     */
    public JarDO findByVersion(String version);
}
