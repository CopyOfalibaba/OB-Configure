package com.alibaba.oceanbase.obconfig.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: BaseDO.java, v 0.1 Jan 23, 2013 3:09:00 PM liangjie.li Exp $
 */
public class BaseDO {

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

}
