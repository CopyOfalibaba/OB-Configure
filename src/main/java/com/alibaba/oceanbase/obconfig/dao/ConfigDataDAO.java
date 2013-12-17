package com.alibaba.oceanbase.obconfig.dao;

import java.util.List;

import com.alibaba.oceanbase.obconfig.entity.ConfigDataDO;

/**
 * 
 * 
 * @author liangjieli
 * @version $Id: ConfigDataDAO.java, v 0.1 Feb 18, 2013 3:15:06 PM liangjieli Exp $
 */
public interface ConfigDataDAO extends BaseDAO<ConfigDataDO> {

    /**
     * 
     * 
     * @param id
     * @return
     */
    public ConfigDataDO findById(String id);

    /**
     * 
     * 
     * @param id
     * @return
     */
    public int deleteById(String id);

    /**
     * 
     * 
     * @return
     */
    public List<ConfigDataDO> findAll();
}
