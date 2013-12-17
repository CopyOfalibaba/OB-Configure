package com.alibaba.oceanbase.obconfig.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: ObUtil.java, v 0.1 2013-4-1 下午1:20:43 liangjie.li Exp $
 */
public class ObUtil {

    public static final Logger logger      = Logger.getLogger(ObUtil.class);

    public static final String OB_USER     = "monitor";
    public static final String OB_PASSWORD = "ocenabasev5_monitor";

    /**
     * 
     * 
     * @param ip
     * @param user
     * @param password
     * @param sql
     * @return
     * @throws SQLException
     */
    public static Map<String, Map<String, Object>> gatherInfo(String ip, String sql) {
        Map<String, Map<String, Object>> map = new HashMap<String, Map<String, Object>>();
        List<Map<String, Object>> records = executeSQL(ip, sql);

        for (Map<String, Object> record : records) {
            String serverIp = (String) record.get("svr_ip");
            String serverType = (String) record.get("svr_type");
            long serverPort = (Long) record.get("svr_port");

            Map<String, Object> _map = map.get(serverIp + "|" + serverType + "|" + serverPort);

            if (_map == null) {
                _map = new HashMap<String, Object>();
                map.put(serverIp + "|" + serverType + "|" + serverPort, _map);
            }

            String monitorName = (String) record.get("name");
            Long monitorValue = (Long) record.get("value");

            _map.put(monitorName, monitorValue);
        }

        return map;
    }

    /**
     * 
     * 
     * @param clusterId
     * @return
     */
    public static List<String> getAllServerIpByClusterId(String dataContent, int clusterId) {
        List<Map<String, Object>> resultList = ObUtil.executeSQL(dataContent,
            Constants.ALL_SERVER_BY_CLUSTER_ID.replace("?", String.valueOf(clusterId)));

        List<String> allServerList = new ArrayList<String>();
        for (Map<String, Object> map : resultList) {
            allServerList.add((String) map.get("svr_ip"));
        }

        return allServerList;
    }

    /**
     * 
     * 
     * @param ip
     * @param sql
     * @return
     */
    public static List<String> getAllClusterIps(String ip) {

        List<String> list = new ArrayList<String>();
        List<Map<String, Object>> records = executeSQL(ip, Constants.ALL_CLUSTER);
        for (Map<String, Object> record : records) {
            String singleClusterIp = String.valueOf(record.get("cluster_vip")) + ":"
                                     + String.valueOf((Long) record.get("cluster_port"));
            list.add(singleClusterIp);
        }
        return list;
    }

    /**
     * 
     * 
     * @param ip
     * @param sql
     * @return
     */
    public static List<Map<String, Object>> executeSQL(String ip, String sql) {

        ip = processIp(ip);

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://" + ip, OB_USER,
                OB_PASSWORD);
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(sql);

            ResultSetMetaData medaData = rs.getMetaData();
            while (rs.next()) {
                Map<String, Object> map = new LinkedHashMap<String, Object>();
                for (int i = 1; i <= medaData.getColumnCount(); i++) {
                    map.put(medaData.getColumnName(i), rs.getObject(i));
                }

                list.add(map);
            }

            closeResultSet(rs);
            closeStatement(stmt);
            closeConnection(connection);
        } catch (Exception e) {
            logger.error("ip:" + ip + ", sql:" + sql, e);
        }

        return list;
    }

    protected static String processIp(String ip) {
        //FIXME: 可以尝试某ip失败后，立即切换其他ip

        ip = ip.split(",")[0];
        ip = ip.trim();

        return ip;
    }

    protected static void closeConnection(Connection conn) throws SQLException {
        if (conn != null) {
            conn.close();
        }
    }

    protected static void closeStatement(Statement stmt) throws SQLException {
        if (stmt != null) {
            stmt.close();
        }
    }

    protected static void closeResultSet(ResultSet rs) throws SQLException {
        if (rs != null) {
            rs.close();
        }
    }

    private ObUtil() {
    }
}
