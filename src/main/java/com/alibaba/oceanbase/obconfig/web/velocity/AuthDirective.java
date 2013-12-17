package com.alibaba.oceanbase.obconfig.web.velocity;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.velocity.context.InternalContextAdapter;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.apache.velocity.runtime.directive.Directive;
import org.apache.velocity.runtime.parser.node.Node;
import org.apache.velocity.runtime.parser.node.SimpleNode;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: AuthDirective.java, v 0.1 2013-4-20 13:07:51 liangjie.li Exp $
 */
public class AuthDirective extends Directive {

    @Override
    public String getName() {
        return "auth";
    }

    @Override
    public int getType() {
        return BLOCK;
    }

    /**
     * 
     * @see org.apache.velocity.runtime.directive.Directive#render(org.apache.velocity.context.InternalContextAdapter, java.io.Writer, org.apache.velocity.runtime.parser.node.Node)
     */
    @Override
    public boolean render(InternalContextAdapter context, Writer writer, Node node)
                                                                                   throws IOException,
                                                                                   ResourceNotFoundException,
                                                                                   ParseErrorException,
                                                                                   MethodInvocationException {
        // get session user id
        SimpleNode employeeId = (SimpleNode) node.jjtGetChild(0);
        String employeeIdString = (String) employeeId.value(context);

        List<String> managers = this.getManagers();

        if (managers.contains(employeeIdString)) {
            Node content = node.jjtGetChild(1);
            content.render(context, writer);
            return true;
        }

        return false;
    }

    private List<String> getManagers() throws IOException {
        List<String> managerInfos = new ArrayList<String>();
        InputStream is = this.getClass().getResourceAsStream("/biz/obconfig-db.properties");
        Properties pro = new Properties();
        pro.load(is);

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            conn = DriverManager.getConnection((String) pro.get("db.url"),
                (String) pro.get("db.username"), (String) pro.get("db.password"));

            stmt = conn.createStatement();
            rs = stmt.executeQuery("select manager_num from manager_info");

            while (rs.next()) {
                managerInfos.add(rs.getString(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

        return managerInfos;
    }

}