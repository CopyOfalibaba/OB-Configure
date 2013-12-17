/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: JarDO.java, v 0.1 2013-3-22 ÏÂÎç12:26:59 liangjie.li Exp $
 */
public class JarDO extends BaseDO implements Serializable {

    /**  */
    private static final long serialVersionUID = 4956442903090858067L;

    private int               id;
    private String            version;
    private String            jarFileName;
    private byte[]            jarFile;
    private Date              createTime;
    private String            checksum;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public byte[] getJarFile() {
        return jarFile;
    }

    public void setJarFile(byte[] jarFile) {
        this.jarFile = jarFile;
    }

    public String getJarFileName() {
        return jarFileName;
    }

    public void setJarFileName(String jarFileName) {
        this.jarFileName = jarFileName;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

}
