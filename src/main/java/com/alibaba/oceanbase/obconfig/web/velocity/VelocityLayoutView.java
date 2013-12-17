/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web.velocity;

import java.io.StringWriter;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.velocity.Template;
import org.apache.velocity.context.Context;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.core.NestedIOException;
import org.springframework.web.servlet.view.velocity.VelocityToolboxView;

import com.alibaba.oceanbase.obconfig.exception.CommonWebException;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: VelocityLayoutView.java, v 0.1 Jan 23, 2013 3:29:29 PM liangjie.li Exp $
 */
public class VelocityLayoutView extends VelocityToolboxView {

    /**
     * The default {@link #setDefaultLayoutUrl(String) layout url}.
     */
    public static final String  DEFAULT_LAYOUT_URL         = "layout.vm";

    /**
     * The default {@link #setLayoutKey(String) layout key}.
     */
    public static final String  DEFAULT_LAYOUT_KEY         = "layout";

    /**
     * The default {@link #setScreenContentKey(String) screen content key}.
     */
    public static final String  DEFAULT_SCREEN_CONTENT_KEY = "screen_content";

    public static final String  IGNORE_LAYOUT              = "ignoreLayout";

    private static final String DEFAULT_LAYOUT_BASE        = "layout/";

    private String              defaultLayoutUrl           = DEFAULT_LAYOUT_URL;

    private String              layoutKey                  = DEFAULT_LAYOUT_KEY;

    private String              screenContentKey           = DEFAULT_SCREEN_CONTENT_KEY;

    /**
     * Set the layout template to use. Default is {@link #DEFAULT_LAYOUT_URL
     * "layout.vm"}.
     * 
     * @param layoutUrl
     *            the template location (relative to the template root
     *            directory)
     */
    public void setDefaultLayoutUrl(String layoutUrl) {
        this.defaultLayoutUrl = layoutUrl;
    }

    /**
     * Set the context key used to specify an alternate layout to be used
     * instead of the default layout. Screen content templates can override the
     * layout template that they wish to be wrapped with by setting this value
     * in the template, for example:<br>
     * <code>#set( $layout = "MyLayout.vm" )</code>
     * <p>
     * Default key is {@link #DEFAULT_LAYOUT_KEY "layout"}, as illustrated
     * above.
     * 
     * @param layoutKey
     *            the name of the key you wish to use in your screen content
     *            templates to override the layout template
     */
    public void setLayoutKey(String layoutKey) {
        this.layoutKey = layoutKey;
    }

    /**
     * Set the name of the context key that will hold the content of the screen
     * within the layout template. This key must be present in the layout
     * template for the current screen to be rendered.
     * <p>
     * Default is {@link #DEFAULT_SCREEN_CONTENT_KEY "screen_content"}: accessed
     * in VTL as <code>$screen_content</code>.
     * 
     * @param screenContentKey
     *            the name of the screen content key to use
     */
    public void setScreenContentKey(String screenContentKey) {
        this.screenContentKey = screenContentKey;
    }

    /**
     * Overrides <code>VelocityView.checkTemplate()</code> to additionally check
     * that both the layout template and the screen content template can be
     * loaded. Note that during rendering of the screen content, the layout
     * template can be changed which may invalidate any early checking done
     * here.
     */
    @Override
    public boolean checkResource(Locale locale) throws Exception {
        if (!super.checkResource(locale)) {
            return false;
        }

        try {
            // Check that we can get the template, even if we might subsequently
            // get it again.
            getTemplate(this.defaultLayoutUrl);
            return true;
        } catch (ResourceNotFoundException ex) {
            throw new NestedIOException("Cannot find Velocity template for URL ["
                                        + this.defaultLayoutUrl
                                        + "]: Did you specify the correct resource loader path?",
                ex);
        } catch (Exception ex) {
            throw new NestedIOException("Could not load Velocity template for URL ["
                                        + this.defaultLayoutUrl + "]", ex);
        }
    }

    /**
     * Overrides the normal rendering process in order to pre-process the
     * Context, merging it with the screen template into a single value
     * (identified by the value of screenContentKey). The layout template is
     * then merged with the modified Context in the super class.
     */
    @Override
    protected void doRender(Context context, HttpServletResponse response) throws Exception {
        renderScreenContent(context);

        String layoutUrlToken = (String) context.get(this.layoutKey);

        // no layout
        if (StringUtils.equalsIgnoreCase(layoutUrlToken, IGNORE_LAYOUT)) {
            mergeTemplate(getTemplate(getUrl()), context, response);
            return;
        }

        // use specified layout
        if (layoutUrlToken != null) {
            mergeLayout(context, response, layoutUrlToken, false);
            return;
        }

        // use try layout with the same name or default layout if not exist
        String sameNameLayoutUrl = LayoutPathUtils.buildSameNameLayoutUrl(DEFAULT_LAYOUT_BASE,
            getUrl());
        mergeLayout(context, response, sameNameLayoutUrl, true);
    }

    private void mergeLayout(Context context, HttpServletResponse response, String layoutUrl,
                             boolean recursion) throws Exception {

        if (mergeLayoutInner(context, response, layoutUrl)) {
            return;
        }
        if (!recursion) {
            throw new CommonWebException("Cannot find Velocity template for URL [" + layoutUrl
                                         + "]: Did you specify the correct resource loader path?");

        }

        String[] sameLevelDefaultLayoutUrls = LayoutPathUtils.buildSameLevelDefaultLayoutUrl(
            layoutUrl, this.defaultLayoutUrl);

        for (String url : sameLevelDefaultLayoutUrls) {
            if (mergeLayoutInner(context, response, url)) {
                return;
            }
        }

        throw new CommonWebException("Cannot find Velocity template for URL ["
                                     + this.defaultLayoutUrl
                                     + "]: Did you specify the correct resource loader path?");

    }

    private boolean mergeLayoutInner(Context context, HttpServletResponse response, String layoutUrl)
                                                                                                     throws Exception {
        Boolean hasLayout = VelocityCache.hasLayout(layoutUrl);

        // need to check
        if (hasLayout == null) {
            if (hasTemplate(layoutUrl)) {
                VelocityCache.markLayoutExist(layoutUrl);
                mergeTemplate(getTemplate(layoutUrl), context, response);
                return true;
            } else {
                VelocityCache.markLayoutNonExist(layoutUrl);
                return false;
            }
        } else if (hasLayout) {
            mergeTemplate(getTemplate(layoutUrl), context, response);
            return true;
        } else {
            return false;
        }
    }

    private boolean hasTemplate(String path) {
        try {
            getTemplate(path);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * The resulting context contains any mappings from render, plus screen
     * content.
     */
    private void renderScreenContent(Context velocityContext) throws Exception {
        if (logger.isDebugEnabled()) {
            logger.debug("Rendering screen content template [" + getUrl() + "]");
        }

        StringWriter sw = new StringWriter();
        Template screenContentTemplate = getTemplate(getUrl());
        screenContentTemplate.merge(velocityContext, sw);
        // Put rendered content into Velocity context.
        velocityContext.put(this.screenContentKey, sw.toString());
    }
}
