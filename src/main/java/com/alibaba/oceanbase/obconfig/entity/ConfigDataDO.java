package com.alibaba.oceanbase.obconfig.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author liangjieli
 * @version $Id: ConfigDataDO.java, v 0.1 Feb 18, 2013 2:53:48 PM liangjie.li Exp$
 */
public class ConfigDataDO extends BaseDO implements Serializable {

    /**  */
    private static final long serialVersionUID = -333024547627785576L;

    private String            dataId;
    private String            username;
    private String            password;
    private String            dataContent;
    private String            jarPath;
    private String            whiteList;
    private int               percentage;
    private int               isUpgrade;
    private String            currentVersion;
    private String            clusterAddress_03;
    private String            masterCluster;
    private String            clusterFlowPercent;
    private String            dsConfig;
    private int               isMonitor;
    private Date              createTime;
    private Date              modifyTime;

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
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

    public String getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(String currentVersion) {
        this.currentVersion = currentVersion;
    }

    public String getClusterAddress_03() {
        return clusterAddress_03;
    }

    public void setClusterAddress_03(String clusterAddress_03) {
        this.clusterAddress_03 = clusterAddress_03;
    }

    public String getMasterCluster() {
        return masterCluster;
    }

    public void setMasterCluster(String masterCluster) {
        this.masterCluster = masterCluster;
    }

    public String getClusterFlowPercent() {
        return clusterFlowPercent;
    }

    public void setClusterFlowPercent(String clusterFlowPercent) {
        this.clusterFlowPercent = clusterFlowPercent;
    }

    public String getDsConfig() {
        return dsConfig;
    }

    public void setDsConfig(String dsConfig) {
        this.dsConfig = dsConfig;
    }

    public int getIsMonitor() {
        return isMonitor;
    }

    public void setIsMonitor(int isMonitor) {
        this.isMonitor = isMonitor;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
