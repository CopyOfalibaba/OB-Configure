package com.alibaba.oceanbase.obconfig.dao;

import java.io.Serializable;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: BaseDAO.java, v 0.1 Jan 23, 2013 3:31:33 PM liangjie.li Exp $
 */
public interface BaseDAO<T> extends Serializable {

    public T insert(T t);

    public int delete(T t);

    public int deleteById(int id);

    public int update(T t);

    public T findById(int id);

    public int saveOrUpdate(T t);

}
