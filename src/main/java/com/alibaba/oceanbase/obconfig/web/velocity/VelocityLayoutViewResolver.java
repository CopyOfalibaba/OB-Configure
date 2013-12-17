/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2012 All Rights Reserved.
 */
package com.alibaba.oceanbase.obconfig.web.velocity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.view.AbstractUrlBasedView;
import org.springframework.web.servlet.view.velocity.VelocityViewResolver;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: VelocityLayoutViewResolver.java, v 0.1 Jan 23, 2013 3:29:41 PM liangjie.li Exp $
 */
public class VelocityLayoutViewResolver extends VelocityViewResolver {

    private static final Logger logger = LoggerFactory.getLogger(VelocityLayoutViewResolver.class);

    private String              layoutKey;
    private String              screenContentKey;
    private String              defaultLayoutUrl;

    /**
     * Requires VelocityLayoutView.
     * 
     * @see VelocityLayoutView
     */
    protected Class<?> requiredViewClass() {
        return VelocityLayoutView.class;
    }

    /**
     * Set the context key used to specify an alternate layout to be used
     * instead of the default layout. Screen content templates can override the
     * layout template that they wish to be wrapped with by setting this value
     * in the template, for example:<br>
     * <code>#set( $layout = "MyLayout.vm" )</code>
     * <p>
     * The default key is "layout", as illustrated above.
     * 
     * @param layoutKey
     *            the name of the key you wish to use in your screen content
     *            templates to override the layout template
     * @see VelocityLayoutView#setLayoutKey
     */
    public void setLayoutKey(final String layoutKey) {
        this.layoutKey = layoutKey;
    }

    public void setDefaultLayoutUrl(String defaultLayoutUrl) {
        this.defaultLayoutUrl = defaultLayoutUrl;
    }

    /**
     * Set the name of the context key that will hold the content of the screen
     * within the layout template. This key must be present in the layout
     * template for the current screen to be rendered.
     * <p>
     * Default is "screen_content": accessed in VTL as
     * <code>$screen_content</code>.
     * 
     * @param screenContentKey
     *            the name of the screen content key to use
     * @see VelocityLayoutView#setScreenContentKey
     */
    public void setScreenContentKey(final String screenContentKey) {
        this.screenContentKey = screenContentKey;
    }

    protected AbstractUrlBasedView buildView(final String viewName) throws Exception {
        if (logger.isDebugEnabled())
            logger.debug("Building view using multiple layout resolver. View name is {}", viewName);

        VelocityLayoutView view = (VelocityLayoutView) super.buildView(viewName);

        if (this.layoutKey != null)
            view.setLayoutKey(this.layoutKey);

        if (this.screenContentKey != null)
            view.setScreenContentKey(this.screenContentKey);

        view.setDefaultLayoutUrl(defaultLayoutUrl);

        return view;
    }

}
