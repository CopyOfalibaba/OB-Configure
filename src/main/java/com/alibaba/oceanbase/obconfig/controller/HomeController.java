package com.alibaba.oceanbase.obconfig.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.alibaba.oceanbase.obconfig.util.UrlPatternConstants;

/**
 * 
 * 
 * @author liangjie.li
 * @version $Id: HomeController.java, v 0.1 Jan 23, 2013 3:30:38 PM liangjie.li Exp $
 */

@Controller
@Scope(value = BeanDefinition.SCOPE_SINGLETON)
@Transactional(rollbackFor = Exception.class, isolation = Isolation.DEFAULT, propagation = Propagation.REQUIRED)
public class HomeController {

    @RequestMapping(value = UrlPatternConstants.HOME_VIEW, method = { RequestMethod.GET,
            RequestMethod.HEAD })
    public ModelAndView home(HttpServletRequest request, ModelAndView mav) {

        RedirectView rv = new RedirectView(UrlPatternConstants.CONFIG_DATA_LIST);
        mav.setView(rv);
        mav.setView(rv);
        return mav;
    }

}