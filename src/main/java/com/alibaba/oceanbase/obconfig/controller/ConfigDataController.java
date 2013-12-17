package com.alibaba.oceanbase.obconfig.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.oceanbase.obconfig.dao.ConfigDataDAO;
import com.alibaba.oceanbase.obconfig.dao.ConfigDataHistoryDAO;
import com.alibaba.oceanbase.obconfig.dao.JarDAO;
import com.alibaba.oceanbase.obconfig.entity.ConfigDataDO;
import com.alibaba.oceanbase.obconfig.entity.ConfigDataHistoryDO;
import com.alibaba.oceanbase.obconfig.entity.JarDO;
import com.alibaba.oceanbase.obconfig.entity.User;
import com.alibaba.oceanbase.obconfig.util.Constants;
import com.alibaba.oceanbase.obconfig.util.ObUtil;
import com.alibaba.oceanbase.obconfig.util.SecureIdentityLoginModule;
import com.alibaba.oceanbase.obconfig.util.UrlPatternConstants;
import com.google.gson.Gson;

/**
 * 
 * 
 * @author liangjieli
 * @version $Id: ConfigController.java, v 0.1 Feb 18, 2013 2:34:30 PM liangjieli Exp $
 */
@Controller
@Scope(value = BeanDefinition.SCOPE_SINGLETON)
@Transactional(rollbackFor = Exception.class, isolation = Isolation.DEFAULT, propagation = Propagation.REQUIRED)
public class ConfigDataController {

    @Autowired
    private ConfigDataDAO        configDataDAO;
    @Autowired
    private ConfigDataHistoryDAO configDataHistoryDAO;
    @Autowired
    private JarDAO               jarDAO;

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_JSON, method = RequestMethod.GET)
    public void configDataJSON(HttpServletResponse response) throws IOException {
        List<ConfigDataDO> configDataDOList = configDataDAO.findAll();
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(configDataDOList));
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_GET_MD5, method = RequestMethod.GET)
    public void configDataMD5(@RequestParam("version") String version, HttpServletResponse response)
                                                                                                    throws IOException {
        JarDO jarDO = jarDAO.findByVersion(version);
        response.setContentType("text/html");
        response.getWriter().write(jarDO.getChecksum());
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_LIST, method = RequestMethod.GET)
    public ModelAndView configDataList(ModelAndView mav) {
        List<ConfigDataDO> configDataDOList = configDataDAO.findAll();

        mav.addObject("configDataDOList", configDataDOList);
        mav.setViewName(UrlPatternConstants.CONFIG_DATA_LIST);
        return mav;
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_LIST_PRO, method = RequestMethod.GET)
    public void configDataListPro(HttpServletResponse response) throws IOException {
        List<ConfigDataDO> configDataDOList = configDataDAO.findAll();
        StringBuilder result = new StringBuilder();

        for (ConfigDataDO cdd : configDataDOList) {
            result.append("dataId=").append(cdd.getDataId()).append(";");
            result.append("dataContent=").append(cdd.getDataContent()).append(";");
            result.append("isMonitor=").append(cdd.getIsMonitor()).append("\r\n");
        }

        response.setContentType("text/html");
        response.getWriter().append(result.toString());
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_DELETE, method = RequestMethod.POST)
    public void configDataDelete(@RequestParam("dataId") String dataId, HttpServletRequest request,
                                 HttpServletResponse response) throws IOException {

        User user = (User) request.getSession().getAttribute(Constants.SESSION_USER);

        boolean result = false;
        if (StringUtils.isNotBlank(dataId)) {

            ConfigDataDO configDataDO = this.configDataDAO.findById(dataId);

            int count = this.configDataDAO.deleteById(dataId);
            if (count > 0) {
                result = true;
            }

            // insert a history record
            ConfigDataHistoryDO configDataHistoryDO = new ConfigDataHistoryDO();
            configDataHistoryDO.setDataId(configDataDO.getDataId());
            configDataHistoryDO.setDataContent(configDataDO.getDataContent());
            configDataHistoryDO.setCreateTime(new Date());
            configDataHistoryDO.setIsUpgrade(configDataDO.getIsUpgrade());
            configDataHistoryDO.setJarPath(configDataDO.getJarPath());
            configDataHistoryDO.setOperate(Constants.OPERATE_DELETE);
            configDataHistoryDO.setOperator(user.getCname());
            configDataHistoryDO.setPercentage(configDataDO.getPercentage());
            configDataHistoryDO.setVersion(configDataDO.getCurrentVersion());
            configDataHistoryDO.setWhiteList(configDataDO.getWhiteList());

            this.configDataHistoryDAO.insert(configDataHistoryDO);
        }

        response.setContentType("text/html");
        response.getWriter().append(String.valueOf(result));
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA, method = RequestMethod.GET)
    public void configDataGet(@RequestParam("dataId") String dataId,
                              @RequestParam(value = "type", required = false) String type,
                              @RequestParam(value = "isEncode", required = false) Boolean isEnocde,
                              HttpServletResponse response) throws Exception {
        if (isEnocde == null) {
            isEnocde = true;
        }
        String result = "dataId:null";
        ConfigDataDO configDataDO = null;
        if (StringUtils.isNotBlank(dataId)) {
            configDataDO = configDataDAO.findById(dataId);
        }

        if ("json".equals(type)) {
            if (configDataDO != null) {
                if (isEnocde) {
                    configDataDO.setPassword(SecureIdentityLoginModule.encode(configDataDO
                        .getPassword()));
                }
                result = JSONObject.fromObject(configDataDO).toString();
            }
            response.setContentType("application/json");
            response.getWriter().write(result);
        } else {
            if (configDataDO != null) {
                response.setContentType("text/html");

                response.getWriter().println("dataId=" + configDataDO.getDataId());
                response.getWriter().println("clusterAddress=" + configDataDO.getDataContent());
                response.getWriter().println("coreJarVersion=" + configDataDO.getCurrentVersion());
                if (configDataDO.getIsUpgrade() == 1) {
                    response.getWriter().println("enableUpdate=true");
                } else {
                    response.getWriter().println("enableUpdate=false");
                }
                response.getWriter().println("coreJarPath=" + configDataDO.getJarPath());
                response.getWriter().println("percentage=" + configDataDO.getPercentage());
                response.getWriter().println("whiteList=" + configDataDO.getWhiteList());
                response.getWriter().println("username=" + configDataDO.getUsername());
                if (StringUtils.isNotBlank(configDataDO.getClusterAddress_03())) {
                    response.getWriter().println(
                        "clusterAddress_03=" + configDataDO.getClusterAddress_03());
                }
                if (StringUtils.isNotBlank(configDataDO.getClusterFlowPercent())) {
                    response.getWriter().println(
                        "clusterFlowPercent=" + configDataDO.getClusterFlowPercent());
                }
                if (StringUtils.isNotBlank(configDataDO.getMasterCluster())) {
                    response.getWriter()
                        .println("masterCluster=" + configDataDO.getMasterCluster());
                }
                if (StringUtils.isNotBlank(configDataDO.getPassword())) {
                    response.getWriter().println(
                        "password=" + SecureIdentityLoginModule.encode(configDataDO.getPassword()));
                }
                if (StringUtils.isNotBlank(configDataDO.getDsConfig())) {
                    response.getWriter().println("dsConfig=" + configDataDO.getDsConfig());
                }
                JarDO jarDO = this.jarDAO.findByVersion(configDataDO.getCurrentVersion());
                if (jarDO != null) {
                    response.getWriter().println("MD5=" + jarDO.getChecksum());
                }
            }
        }
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA_ROLLBACK, method = RequestMethod.POST)
    public void configDataRollBack(@RequestParam(value = "dataId", required = false) String dataId,
                                   HttpServletResponse response) throws IOException {

        if (StringUtils.isNotBlank(dataId)) {// begin to execute rollback operate
            ConfigDataHistoryDO configDataHistoryDO = this.configDataHistoryDAO
                .findLatestRecordByDataId(dataId);
            ConfigDataDO configDataDO = this.configDataDAO.findById(dataId);

            configDataDO.setCurrentVersion(configDataHistoryDO.getVersion());
            configDataDO.setDataContent(configDataHistoryDO.getDataContent());
            configDataDO.setIsUpgrade(configDataHistoryDO.getIsUpgrade());
            configDataDO.setJarPath(configDataHistoryDO.getJarPath());
            configDataDO.setModifyTime(new Date());
            configDataDO.setPercentage(configDataHistoryDO.getPercentage());
            configDataDO.setWhiteList(configDataHistoryDO.getWhiteList());

            int count = this.configDataDAO.update(configDataDO);

            boolean result = false;
            if (count > 0) {
                result = true;
            }

            response.setContentType("text/html");
            response.getWriter().append(String.valueOf(result));
        }
    }

    @RequestMapping(value = UrlPatternConstants.CONFIG_DATA, method = RequestMethod.POST)
    public void configDataPost(HttpServletRequest request,
                               @RequestParam("dataId") String dataId,
                               @RequestParam("jarPath") String jarPath,
                               @RequestParam("whiteList") String whiteList,
                               @RequestParam("currentVersion") String currentVersion,
                               @RequestParam("isUpgrade") Integer isUpgrade,
                               @RequestParam("percentage") Integer percentage,
                               @RequestParam("data") String data,
                               @RequestParam("username") String username,
                               @RequestParam("password") String password,
                               @RequestParam(value = "clusterAddress_03", required = false) String clusterAddress_03,
                               @RequestParam(value = "percent0_3", required = false) String percent0_3,
                               @RequestParam(value = "percent0_4", required = false) String percent0_4,
                               @RequestParam(value = "masterCluster", required = false) String masterCluster,
                               @RequestParam(value = "isMonitor", required = false) Integer isMonitor,
                               @RequestParam(value = "dsConfig", required = false) String dsConfig,
                               HttpServletResponse response) throws IOException {

        User user = (User) request.getSession().getAttribute(Constants.SESSION_USER);

        boolean result = false;
        if (StringUtils.isNotBlank(dataId) && StringUtils.isNotBlank(data)) {
            ConfigDataDO configDataDO = new ConfigDataDO();
            configDataDO.setCreateTime(new Date());
            configDataDO.setModifyTime(new Date());
            configDataDO.setUsername(username);
            configDataDO.setPassword(password);
            configDataDO.setDataId(dataId);
            configDataDO.setDataContent(data);
            configDataDO.setJarPath(jarPath);
            configDataDO.setWhiteList(whiteList);
            configDataDO.setCurrentVersion(currentVersion);
            configDataDO.setIsUpgrade(isUpgrade);
            configDataDO.setPercentage(percentage);
            configDataDO.setIsMonitor(isMonitor);
            dsConfig = dsConfig.replaceAll("\r|\n", "").trim();
            configDataDO.setDsConfig(dsConfig);

            if (StringUtils.isNotBlank(clusterAddress_03)) {
                configDataDO.setClusterAddress_03(clusterAddress_03);
            }
            if (StringUtils.isNotBlank(percent0_4) && StringUtils.isNotBlank(percent0_3)) {
                configDataDO.setClusterFlowPercent("0.3:" + percent0_3 + "|0.4:" + percent0_4);
            }
            if (StringUtils.isNotBlank(masterCluster)) {
                configDataDO.setMasterCluster(masterCluster);
            }

            int count = this.configDataDAO.saveOrUpdate(configDataDO);
            if (count > 0) {
                result = true;
            }

            // insert a operation record
            ConfigDataHistoryDO configDataHistoryDO = new ConfigDataHistoryDO();
            configDataHistoryDO.setDataId(dataId);
            configDataHistoryDO.setDataContent(data);
            configDataHistoryDO.setCreateTime(new Date());
            configDataHistoryDO.setIsUpgrade(isUpgrade);
            configDataHistoryDO.setJarPath(jarPath);
            configDataHistoryDO.setOperator(user.getCname());
            configDataHistoryDO.setPercentage(percentage);
            configDataHistoryDO.setVersion(currentVersion);
            configDataHistoryDO.setWhiteList(whiteList);
            if (count == 100) {
                configDataHistoryDO.setOperate(Constants.OPERATE_INSERT);
            } else {
                configDataHistoryDO.setOperate(Constants.OPERATE_UPDATE);
            }

            this.configDataHistoryDAO.insert(configDataHistoryDO);
        }

        response.setContentType("text/html");
        response.getWriter().append(String.valueOf(result));
    }

    @RequestMapping(value = UrlPatternConstants.CLIENT_STATUS_LIST, method = RequestMethod.GET)
    public ModelAndView clientStatusList(@RequestParam("dataId") String dataId, ModelAndView mav)
                                                                                                 throws SQLException {

        if (StringUtils.isNotBlank(dataId)) {
            ConfigDataDO configDataDO = this.configDataDAO.findById(dataId);
            List<Map<String, Object>> list = ObUtil.executeSQL(configDataDO.getDataContent(),
                Constants.ALL_CLIENT);
            mav.addObject("records", list);
        }

        mav.setViewName("/configdata/clientstatus");

        return mav;
    }

    @RequestMapping(value = UrlPatternConstants.ENCODE_PASS)
    public ModelAndView encodePass(@RequestParam(value = "pass", required = false) String pass,
                                   ModelAndView mav) throws InvalidKeyException,
                                                    NoSuchPaddingException,
                                                    NoSuchAlgorithmException, BadPaddingException,
                                                    IllegalBlockSizeException,
                                                    UnsupportedEncodingException {

        if (StringUtils.isNotBlank(pass)) {
            String password = SecureIdentityLoginModule.encode(pass);
            mav.addObject("password", password);
        }
        mav.setViewName(UrlPatternConstants.ENCODE_PASS);

        return mav;
    }
}
