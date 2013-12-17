/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2013 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.entity;

/**
 * 
 * @author liangjie.li@alipay.com
 * @version $Id: ConfigDataHistory.java, v 0.1 2013-3-25 ÏÂÎç2:01:33 liangjie.li Exp $
 */
public class ConfigDataHistoryDO extends BaseDO implements java.io.Serializable {

    /**  */
    private static final long serialVersionUID = -2077384887120221949L;

    private String            dataId;
    private String            version;
    private String            dataContent;
    private String            jarPath;
    private String            whiteList;
    private int               percentage;
    private int               isUpgrade;

    private String            operator;
    private String            operate;
    private java.util.Date    createTime;

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDataContent() {
        return dataContent;
    }

    public void setDataContent(String dataContent) {
        this.dataContent = dataContent;
    }

    public String getJarPath() {
        return jarPath;
    }

    public void setJarPath(String jarPath) {
        this.jarPath = jarPath;
    }

    public String getWhiteList() {
        return whiteList;
    }

    public void setWhiteList(String whiteList) {
        this.whiteList = whiteList;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public int getIsUpgrade() {
        return isUpgrade;
    }

    public void setIsUpgrade(int isUpgrade) {
        this.isUpgrade = isUpgrade;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getOperate() {
        return operate;
    }

    public void setOperate(String operate) {
        this.operate = operate;
    }

    public java.util.Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(java.util.Date createTime) {
        this.createTime = createTime;
    }

}
