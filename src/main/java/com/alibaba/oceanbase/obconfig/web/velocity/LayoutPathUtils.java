/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web.velocity;

import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: LayoutPathUtils.java, v 0.1 Jan 23, 2013 3:28:37 PM liangjie.li Exp $
 */
public class LayoutPathUtils {

    private static Pattern SEPARATOR_PATTERN = Pattern.compile("/");

    /**
     * 
     * 
     * @param layoutBase
     * @param viewName
     * @return
     */
    public static String buildSameNameLayoutUrl(String layoutBase, String viewName) {
        boolean isEndsWith = layoutBase.endsWith("/");
        boolean isStartsWith = viewName.startsWith("/");

        if (isEndsWith && isStartsWith) {

            return layoutBase + viewName.substring(1);
        }

        if (!isEndsWith && !isStartsWith) {

            return layoutBase + '/' + viewName;
        }

        return layoutBase + viewName;
    }

    /**
     * exclude layoutUrl if it is a defaultLayoutUrl
     * 
     * @param layoutUrl
     * @param defaultLayoutUrl
     * @return
     */
    public static String[] buildSameLevelDefaultLayoutUrl(String layoutUrl, String defaultLayoutUrl) {

        String[] targetUrlTokens = SEPARATOR_PATTERN.split(layoutUrl);
        int effectiveTargetTokenCount = targetUrlTokens.length;

        String[] defaultUrlTokens = SEPARATOR_PATTERN.split(defaultLayoutUrl);
        int effectiveDefaultTokenCount = defaultUrlTokens.length;

        int targetBaseIndex = 0;
        int defaultBaseIndex = 0;
        if (StringUtils.isBlank(targetUrlTokens[0])) {
            targetBaseIndex++;
        }
        if (StringUtils.isBlank(defaultUrlTokens[0])) {
            defaultBaseIndex++;
        }
        effectiveTargetTokenCount -= targetBaseIndex;
        effectiveDefaultTokenCount -= defaultBaseIndex;

        // not from layout base dir, so no other default layout
        if (effectiveTargetTokenCount < effectiveDefaultTokenCount) {
            return new String[] { defaultLayoutUrl };
        }

        int commondIndex = 0;

        for (int i = 0; i < targetUrlTokens.length; i++) {

            if (!targetUrlTokens[targetBaseIndex + i]
                .equals(defaultUrlTokens[defaultBaseIndex + i])) {
                break;
            }
            commondIndex++;
        }

        // layoutUrl are effectively equal to defaultLayoutUrl
        if (commondIndex == effectiveTargetTokenCount) {

            return new String[] {};
        }

        // not from layout base dir, so no other default layout
        if (commondIndex + 1 != effectiveDefaultTokenCount) {

            return new String[] { defaultLayoutUrl };
        }

        int urlCount = effectiveTargetTokenCount - commondIndex;

        String defaultLayoutFileName = defaultUrlTokens[defaultUrlTokens.length - 1];

        boolean targetWithDefaultFileName = targetUrlTokens[targetUrlTokens.length - 1]
            .equals(defaultLayoutFileName);
        if (targetWithDefaultFileName) {
            urlCount--;
        }

        String[] urls = new String[urlCount];

        // should not occurs because (commondIndex ==
        // effectiveTargetTokenCount) will catch this case
        if (urlCount == 0) {
            return urls;
        }

        urls[urlCount - 1] = defaultLayoutUrl;
        if (urlCount == 1) {

            return urls;
        }

        int left = urlCount - 1;
        int tailIndex = targetUrlTokens.length - 1;
        if (targetWithDefaultFileName) {
            tailIndex--;
        }
        int urlIndex = 0;
        while (urlIndex < left) {

            StringBuilder buffer = new StringBuilder();
            for (int i = 0; i < tailIndex; i++) {
                buffer.append(targetUrlTokens[i]);
                buffer.append('/');
            }
            buffer.append(defaultLayoutFileName);

            urls[urlIndex++] = buffer.toString();
            tailIndex--;
        }

        return urls;
    }
}
