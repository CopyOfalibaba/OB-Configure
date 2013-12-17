/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

import org.apache.commons.lang.StringUtils;
import org.apache.velocity.app.event.ReferenceInsertionEventHandler;
import org.apache.velocity.runtime.RuntimeServices;
import org.apache.velocity.util.RuntimeServicesAware;

import com.alibaba.oceanbase.obconfig.exception.CommonWebException;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: CommonEscapeHtmlReference.java, v 0.1 Jan 23, 2013 3:23:36 PM liangjie.li Exp $
 */
public class CommonEscapeHtmlReference implements ReferenceInsertionEventHandler,
                                      RuntimeServicesAware {
    private String nonescapeEqualsKey;
    private String nonescapeEndsWithKey;

    /**
     * Called automatically when event cartridge is initialized.
     * 
     * @param rs
     *            instance of RuntimeServices
     */

    public void setRuntimeServices(RuntimeServices rs) {

        nonescapeEqualsKey = StringUtils.trimToNull(rs.getConfiguration().getString(
            "eventhandler.nonescape.html.equals"));

        nonescapeEndsWithKey = StringUtils.trimToNull(rs.getConfiguration().getString(
            "eventhandler.nonescape.html.endsWith"));

        if (nonescapeEqualsKey == null || nonescapeEndsWithKey == null) {
            throw new CommonWebException(
                "Check your velocity.properties for the value of eventhandler.nonescape.html.equals and eventhandler.nonescape.html.endsWith");
        }

    }

    public Object referenceInsert(String reference, Object value) {

        if (value == null) {
            return value;
        }

        String name = extractReferenceName(reference);
        if (name.equals(nonescapeEqualsKey)) {

            return value;
        } else if (name.endsWith(nonescapeEndsWithKey)) {

            return value;
        } else {

            return escape(value.toString());
        }
    }

    public static String extractReferenceName(String reference) {

        int length = reference.length();
        char lastChar = reference.charAt(length - 1);

        int nameStartFrom = reference.charAt(1) == '!' ? 2 : 1;

        if (lastChar == ')') {

            return reference.substring(nameStartFrom, length - 2);
        }

        if (lastChar != '}') {

            return reference.substring(nameStartFrom);
        }

        if (reference.charAt(length - 2) == ')') {

            return reference.substring(nameStartFrom + 1, length - 3);
        }

        return reference.substring(nameStartFrom + 1, length - 1);

    }

    /**
     * @see StringEscapeUtils.escapeHtml(String)
     */
    private String escape(String str) {

        if (str == null) {
            return null;
        }
        try {
            StringWriter writer = new StringWriter((int) (str.length() * 1.5));
            escapeHtml(writer, str);
            return writer.toString();
        } catch (IOException e) {
            throw new CommonWebException(e);
        }
    }

    /**
     * @see StringEscapeUtils.escapeHtml(Writer, String)
     */
    private static void escapeHtml(Writer writer, String string) throws IOException {
        Entities.HTML40.escape(writer, string);
    }

}
