/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web.interceptors;

import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: PullToolsPreparationInterceptor.java, v 0.1 Jan 23, 2013 3:28:22 PM liangjie.li Exp $
 */
public class PullToolsPreparationInterceptor extends HandlerInterceptorAdapter {
    private Map<String, Object> tools;

    // before the actual handler will be executed
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {

        for (Entry<String, Object> entry : tools.entrySet()) {
            request.setAttribute(entry.getKey(), entry.getValue());
        }

        return true;
    }

    public void setTools(Map<String, Object> tools) {
        this.tools = tools;
    }
}
