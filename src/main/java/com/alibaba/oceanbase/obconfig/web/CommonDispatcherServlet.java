/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web;

import static com.alibaba.oceanbase.obconfig.util.Constants.SESSION_USER;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.DispatcherServlet;

import com.alibaba.oceanbase.obconfig.entity.User;

/**
 * common dispatcher servlet, it's a customer dispatcher!
 * 
 * @author liangjie.li
 * @version $Id: CommonDispatcherServlet.java, v 0.1 Jan 23, 2013 3:23:56 PM liangjie.li Exp $
 */
public class CommonDispatcherServlet extends DispatcherServlet {

    private static final long   serialVersionUID = 541137914548149001L;

    private static final Logger logger           = LoggerFactory
                                                     .getLogger(CommonDispatcherServlet.class);

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    /**
     * 
     * @see org.springframework.web.servlet.DispatcherServlet#doService(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doService(HttpServletRequest request, HttpServletResponse response)
                                                                                      throws Exception {
        try {

            // get user info 
            HttpSession session = request.getSession();
            User user = (User) session.getAttribute(SESSION_USER);
            if (user == null) {
                Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (Cookie c : cookies) {
                        if (c.getName().equals("TBSSO")) {
                            user = getUserFromCookie(c);
                            session.setAttribute(SESSION_USER, user);

                            break;
                        }
                    }
                }
            }

            super.doService(request, response);

            if (logger.isDebugEnabled()) {
                logger.debug("access uri:" + request.getRequestURI());
            }
        } catch (Exception e) {

            Throwable t = e.getCause();
            if (t == null) {
                logger.error("", e);
                // trigger 500 code and error page
                throw e;
            }

            logger.error("", e);

            // trigger 500 code and error page
            throw e;
        }
    }

    /**
     * 
     * 
     * @param c
     * @return
     * @throws UnsupportedEncodingException 
     */
    private User getUserFromCookie(Cookie c) throws UnsupportedEncodingException {
        User user = new User();

        String value = c.getValue();
        value = URLDecoder.decode(value, "UTF-8");
        String[] array = value.split("&");
        for (String s : array) {
            String[] pair = s.split("=");
            if ("id".equals(pair[0])) {
                user.setId(Integer.parseInt(pair[1]));
            } else if ("userid".equals(pair[0])) {
                user.setUserId(URLDecoder.decode(pair[1], "utf8"));
            } else if ("sign".equals(pair[0])) {
                user.setSign(URLDecoder.decode(pair[1], "utf8"));
            } else if ("time".equals(pair[0])) {
                Long timestamp = Long.parseLong(pair[1]);
                user.setLoginTime(new Date(timestamp * 1000));
            } else if ("expires".equals(pair[0])) {
                user.setExpires(Integer.parseInt(pair[1]));
            } else if ("ip".equals(pair[0])) {
                user.setLoginIp(pair[1]);
            } else if ("roles".equals(pair[0])) {
                user.setRoles(Integer.parseInt(pair[1]));
            } else if ("cname".equals(pair[0])) {
                user.setCname(URLDecoder.decode(pair[1], "utf8"));
            } else if ("employeeid".equals(pair[0])) {
                user.setEmployeeId(URLDecoder.decode(pair[1], "utf8"));
            } else if ("managerid".equals(pair[0])) {
                user.setManagerId(pair[1]);
            } else if ("corp".equals(pair[0])) {
                user.setCorp(URLDecoder.decode(pair[1], "utf8"));
            } else if ("tel".equals(pair[0])) {
                user.setTel(pair[1]);
            } else if ("email".equals(pair[0])) {
                user.setEmail(pair[1]);
            } else if ("dep".equals(pair[0])) {
                user.setDep(URLDecoder.decode(pair[1], "utf8"));
            } else if ("param".equals(pair[0])) {
                user.setParam(pair[1]);
            }
        }

        return user;
    }

}